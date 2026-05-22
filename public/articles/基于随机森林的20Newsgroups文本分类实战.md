# 基于随机森林的20Newsgroups文本分类实战

## 1. 项目概述

本文详细介绍了使用随机森林算法对20Newsgroups数据集进行文本分类的完整流程。这个数据集包含20个不同主题的新闻组，涵盖了从计算机技术到宗教信仰的广泛话题。通过TF-IDF特征提取、模型训练、评估和优化，实现了84.14%的分类准确率。

## 2. 环境准备与数据加载

### 2.1 导入必要的库

```python
# 数据集获取
from sklearn.datasets import fetch_20newsgroups

# 文本特征提取
from sklearn.feature_extraction.text import TfidfVectorizer

# 随机森林模型
from sklearn.ensemble import RandomForestClassifier

# 评估模型性能
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score

# 划分训练集和测试集
from sklearn.model_selection import train_test_split

# 可选：用于超参数调优
from sklearn.model_selection import GridSearchCV

# 可视化
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# 设置matplotlib中文字体
plt.rcParams['font.sans-serif'] = ['SimHei']
plt.rcParams['axes.unicode_minus'] = False
```

### 2.2 加载数据集

```python
# 下载并加载20newsgroups数据集
news = fetch_20newsgroups(subset='all',
                          shuffle=True,
                          random_state=42)

# 查看数据的基本信息
print("数据集键值:", news.keys())
print("类别名称:", news.target_names)
print("文档数量:", len(news.data))
print("数据类型:", type(news.data))

# 数据内容和对应的标签
X_text = news.data  # 这是一个列表，里面是所有新闻的文本内容
y = news.target  # 这是一个数组，里面是每个文本对应的类别编号（0-19）

print(f"\n第一个文档的前500个字符:")
print(news.data[0][:500])
```

> **关键点**：`remove=('headers', 'footers', 'quotes')`是一个常用的技巧，它移除了每篇新闻的元信息（如发件人、主题等），迫使模型更专注于新闻正文内容本身，这通常会稍微降低准确率但让模型更通用。你可以去掉这个参数来获得更高的准确率。

**输出结果：**

```tex
数据集键值: dict_keys(['data', 'filenames', 'target_names', 'target', 'DESCR'])
类别名称: ['alt.atheism', 'comp.graphics', 'comp.os.ms-windows.misc', 'comp.sys.ibm.pc.hardware', 'comp.sys.mac.hardware', 'comp.windows.x', 'misc.forsale', 'rec.autos', 'rec.motorcycles', 'rec.sport.baseball', 'rec.sport.hockey', 'sci.crypt', 'sci.electronics', 'sci.med', 'sci.space', 'soc.religion.christian', 'talk.politics.guns', 'talk.politics.mideast', 'talk.politics.misc', 'talk.religion.misc']
文档数量: 18846
数据类型: <class 'list'>

第一个文档的前500个字符:
From: Mamatha Devineni Ratnam <mr47+@andrew.cmu.edu>
Subject: Pens fans reactions
Organization: Post Office, Carnegie Mellon, Pittsburgh, PA
Lines: 12
NNTP-Posting-Host: po4.andrew.cmu.edu



I am sure some bashers of Pens fans are pretty confused about the lack
of any kind of posts about the recent Pens massacre of the Devils. Actually,
I am  bit puzzled too and a bit relieved. However, I am going to put an end
to non-PIttsburghers' relief with a bit of praise for the Pens. Man, they
are killin
```

## 3. 文本向量化处理

### 3.1 TF-IDF原理简介

这是将文本转换为随机森林可以理解的数字格式的过程。我们使用 **TF-IDF** 方法，它是一种统计方法，用以评估一字词对于一个文件集或一个语料库中的其中一份文件的重要程度。

TF-IDF（Term Frequency-Inverse Document Frequency）是一种在自然语言处理（NLP）和信息检索中广泛使用的文本特征提取方法，用于衡量一个词在文档集合中的**重要性**。它的核心思想是：**一个词的重要性与它在当前文档中出现的频率成正比，但与它在整个文档集合中出现的频率成反比**。

- **TF（Term Frequency，词频）**：统计一个词在当前文档中出现的频率。
- **IDF（Inverse Document Frequency，逆文档频率）**：衡量一个词在整个文档集合中的“稀有性”（即区分度）。

```
# TF-IDF简单示例
corpus = [
    "机器学习 深度学习 算法",
    "机器学习 自然语言处理",
    "深度学习 计算机视觉"
]
tfidf = TfidfVectorizer()
tfidf_matrix = tfidf.fit_transform(corpus)
print("TF-IDF矩阵:")
print(tfidf_matrix.toarray())
print("特征名称:", tfidf.get_feature_names_out())
```

**输出结果：**

```
TF-IDF矩阵:
[[0.51785612 0.51785612 0.68091856 0.         0.        ]
 [0.60534851 0.         0.         0.79596054 0.        ]
 [0.         0.60534851 0.         0.         0.79596054]]
特征名称: ['机器学习' '深度学习' '算法' '自然语言处理' '计算机视觉']
```

### 3.2 实际文本向量化

```python
# 初始化一个TF-IDF向量化器
# max_features=5000 表示只考虑数据集中最常见的5000个单词作为特征。
# 这可以降低特征维度，加快训练速度，有时甚至能提升模型表现（减少了噪声特征）。
vectorizer = TfidfVectorizer(max_features=5000,
                             stop_words='english',  # 移除英文停用词（如'the', 'is', 'and'）
                             lowercase=True,  # 将所有字符转换为小写
                             ngram_range=(1, 2)  # 考虑一元词组和二元词组（如 "not good"）
                             )
# 将全部文本数据进行拟合和转换
X_features = vectorizer.fit_transform(X_text)

# 查看转换后的特征矩阵形状
print(f"特征矩阵的形状为：{X_features.shape}")
print(f"特征数量：{X_features.shape[1]}")
```

**关键参数解释**：

- `max_features`：限制特征数量，防止维度爆炸，至关重要。
- `stop_words`：移除常见但无实际意义的词。
- `ngram_range=(1, 2)`：不仅考虑单个词，还考虑相邻词的组合，可以捕捉到像“not good”这样的短语，对性能提升很大。

**输出结果：**

```
特征矩阵的形状为：(18846, 5000)
特征数量：5000
```

## 4. 数据划分

```
# 划分训练集和测试集
X_train, X_test, y_train, y_test = train_test_split(
    X_features,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y  # 保证训练集和测试集中各类别比例一致
)

print(f"训练集大小: {X_train.shape[0]}")
print(f"测试集大小: {X_test.shape[0]}")
print(f"训练集特征维度: {X_train.shape[1]}")
```

**输出结果：**

```
训练集大小: 15076
测试集大小: 3770
训练集特征维度: 5000
```



## 5. 随机森林模型训练

### 5.1 模型初始化与训练

```python
# 初始化随机森林分类器
# n_estimators=100：森林中树的数量，通常100-500是个不错的选择
# random_state=42：保证每次运行结果一致
# n_jobs=-1：使用所有可用的CPU核心进行并行计算，加快训练速度
rf_classifier = RandomForestClassifier(
    n_estimators=500,
    random_state=42,
    n_jobs=-1)

# 在训练集上训练模型
print("开始训练随机森林模型...")
rf_classifier.fit(X_train, y_train)
print("模型训练完成！")

# 查看模型参数
print("\n模型参数:")
print(rf_classifier.get_params())
```

**输出结果：**

```
开始训练随机森林模型...
模型训练完成！

模型参数:
{'bootstrap': True, 'ccp_alpha': 0.0, 'class_weight': None, 'criterion': 'gini', 'max_depth': None, 'max_features': 'sqrt', 'max_leaf_nodes': None, 'max_samples': None, 'min_impurity_decrease': 0.0, 'min_samples_leaf': 1, 'min_samples_split': 2, 'min_weight_fraction_leaf': 0.0, 'monotonic_cst': None, 'n_estimators': 500, 'n_jobs': -1, 'oob_score': False, 'random_state': 42, 'verbose': 0, 'warm_start': False}
```

### 5.2 模型预测与评估

```python
# 使用训练好的模型对测试集进行预测
y_pred = rf_classifier.predict(X_test)

# 计算并打印准确率
accuracy = accuracy_score(y_test, y_pred)
print(f"随机森林模型的准确率为：{accuracy:.4f}")

# 打印详细的评估报告
print("\n===== 随机森林分类报告 =====")
print(classification_report(y_test,
                            y_pred,
                            target_names=news.target_names))

# 计算混淆矩阵
cm = confusion_matrix(y_test, y_pred)
print("混淆矩阵形状:", cm.shape)
```

**输出结果：**

```
随机森林模型的准确率为：0.8414

===== 随机森林分类报告 =====
                          precision    recall  f1-score   support

             alt.atheism       0.91      0.80      0.85       160
           comp.graphics       0.74      0.76      0.75       195
 comp.os.ms-windows.misc       0.80      0.83      0.81       197
comp.sys.ibm.pc.hardware       0.68      0.72      0.70       196
   comp.sys.mac.hardware       0.84      0.82      0.83       193
          comp.windows.x       0.92      0.83      0.87       198
            misc.forsale       0.86      0.87      0.86       195
               rec.autos       0.81      0.84      0.82       198
         rec.motorcycles       0.90      0.83      0.86       199
      rec.sport.baseball       0.84      0.89      0.86       199
        rec.sport.hockey       0.93      0.93      0.93       200
               sci.crypt       0.95      0.95      0.95       198
         sci.electronics       0.73      0.77      0.75       197
                 sci.med       0.77      0.87      0.82       198
               sci.space       0.86      0.93      0.90       197
  soc.religion.christian       0.85      0.97      0.91       199
      talk.politics.guns       0.82      0.86      0.84       182
   talk.politics.mideast       0.95      0.93      0.94       188
      talk.politics.misc       0.87      0.77      0.82       155
      talk.religion.misc       0.97      0.52      0.68       126

                accuracy                           0.84      3770
               macro avg       0.85      0.83      0.84      3770
            weighted avg       0.85      0.84      0.84      3770

混淆矩阵形状: (20, 20)
```

## 6. 特征重要性分析

```
# 获取特征重要性
feature_importance_rf = rf_classifier.feature_importances_
feature_names = vectorizer.get_feature_names_out()

# 可视化最重要的20个特征
n = 20
top_indices = np.argsort(feature_importance_rf)[-n:][::-1]
top_importance = feature_importance_rf[top_indices]
top_features = feature_names[top_indices]

plt.figure(figsize=(12, 8))
plt.bar(range(n), top_importance)
plt.xticks(range(n), top_features, rotation=45, ha='right')
plt.title("Top 20 特征重要性")
plt.ylabel("重要性得分")
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=300, bbox_inches='tight')
plt.show()

# 打印重要特征
print("最重要的20个特征:")
for i, (feature, importance) in enumerate(zip(top_features, top_importance)):
    print(f"{i+1:2d}. {feature}: {importance:.6f}")
```

**输出结果：**

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4ea7afe9a99c4aeabf44ec3977674ce9.png#pic_center)


```
最重要的20个特征:
 1. windows: 0.011762
 2. sale: 0.011548
 3. dod: 0.011214
 4. bike: 0.010135
 5. car: 0.009693
 6. space: 0.007306
 7. clipper: 0.006763
 8. israel: 0.006401
 9. mac: 0.006366
10. hockey: 0.006304
11. baseball: 0.006239
12. cars: 0.005888
13. graphics: 0.005635
14. god: 0.005372
15. gun: 0.005178
16. nhl: 0.005078
17. encryption: 0.004944
18. game: 0.004920
19. team: 0.004582
20. apple: 0.004398
```

## 7. 调整树的数量观察结果

```python
# 研究树的数量对性能的影响
n_trees = [1, 5, 10, 50, 100, 200, 500]
train_acc = []
test_acc = []

# 使用warm_start来增量训练，避免重复训练
rf = RandomForestClassifier(warm_start=True, random_state=42, n_jobs=-1)

for n in n_trees:
    print(f"训练 {n} 棵树...")
    rf.n_estimators = n
    rf.fit(X_train, y_train)

    # 预测
    y_train_pred = rf.predict(X_train)
    y_test_pred = rf.predict(X_test)

    # 计算准确率
    train_acc.append(accuracy_score(y_train, y_train_pred))
    test_acc.append(accuracy_score(y_test, y_test_pred))
    print(f"  训练准确率: {train_acc[-1]:.4f}, 测试准确率: {test_acc[-1]:.4f}")

# 绘制结果
plt.figure(figsize=(10, 6))
plt.plot(n_trees, train_acc, 'o-', label='训练准确率', linewidth=2)
plt.plot(n_trees, test_acc, 'o-', label='测试准确率', linewidth=2)
plt.xlabel('树的数量')
plt.ylabel('准确率')
plt.title('树的数量对随机森林性能的影响')
plt.legend()
plt.grid(True, alpha=0.3)
plt.xscale('log')
plt.xticks(n_trees, n_trees)
plt.tight_layout()
plt.savefig('n_estimators_impact.png', dpi=300, bbox_inches='tight')
plt.show()

# 打印最佳参数
best_n = n_trees[np.argmax(test_acc)]
print(f"\n最佳树数量: {best_n}")
print(f"对应的测试准确率: {max(test_acc):.4f}")
```

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/4f8ace895fa647f6b0cf8fd194535dfd.png#pic_center)


```
训练 1 棵树...
  训练准确率: 0.8262, 测试准确率: 0.5464
训练 5 棵树...
  训练准确率: 0.9738, 测试准确率: 0.7122
训练 10 棵树...
  训练准确率: 0.9956, 测试准确率: 0.7684
训练 50 棵树...
  训练准确率: 1.0000, 测试准确率: 0.8297
训练 100 棵树...
  训练准确率: 1.0000, 测试准确率: 0.8321
训练 200 棵树...
  训练准确率: 1.0000, 测试准确率: 0.8366
训练 500 棵树...
  训练准确率: 1.0000, 测试准确率: 0.8414
  


最佳树数量: 500
对应的测试准确率: 0.8414
```

## 8.运行

本文所有代码均可直接运行，请确保已安装以下Python库：

```shell
pip install scikit-learn matplotlib numpy pandas
```


**注意事项：**

- 首次运行时会自动下载20Newsgroups数据集（约14MB）
    - 如何下载20Newsgroups数据集，可查看：[【机器学习】朴素贝叶斯实战：20 Newsgroups新闻分类全流程解析_(朴素贝叶斯分类器)新闻分类-CSDN博客](https://blog.csdn.net/lieyanfeiniao_/article/details/149535272?spm=1001.2014.3001.5502)
- 随机森林训练可能需要几分钟时间，取决于硬件配置
- 建议使用Jupyter Notebook分段运行以便调试

项目完整代码已开源至：https://gitcode.com/lieyanfeiniao_/machine-learning-code.git

## 9. 文化角——处暑节气

处暑，是二十四节气中的第十四个节气，通常在公历8月23日左右。"处"意为终止，"暑"代表炎热，处暑即表示炎热的夏天即将结束。这个时节，暑气渐消，秋意渐浓，正是天气由热转凉的过渡期。

处暑时节，民间有"放河灯"、"开渔节"等传统习俗。此时农作物开始成熟，是收获的前奏。在养生方面，处暑后应注意"秋燥"，宜食清热安神之品，如银耳、百合、莲子等，保持作息规律，为秋冬季节做好身体准备。

