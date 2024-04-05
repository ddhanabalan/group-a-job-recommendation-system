#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import numpy as np
import nltk


# In[2]:


data=pd.read_csv("Combined_Jobs_Final.csv")
data.head()


# In[3]:


data.isnull().sum()


# In[4]:


data.nunique()


# In[5]:


edu_level = data["Education.Required"].value_counts().reset_index()
edu_level.columns = ["Education.Required", "count"]
import seaborn as sns
import matplotlib.pyplot as plt
#define Seaborn color palette to use
colors = sns.color_palette("pastel")

#create pie chart
plt.figure(facecolor='white', figsize=(6,8))
plt.pie(edu_level["count"], colors = colors, autopct="%.0f%%", pctdistance=1.1)
plt.title("Groups of required education level", fontsize=16)
plt.legend(edu_level["Education.Required"], loc="upper center", bbox_to_anchor=(0.5, -0.04), ncol=3, fontsize=12)

plt.show()


# In[6]:


industry = data["Industry"].value_counts().reset_index()
industry.columns = ["Industry", "count"]

#define Seaborn color palette to use
colors = sns.color_palette("pastel")

#create pie chart
plt.figure(facecolor='white', figsize=(6,8))
plt.pie(industry["count"], colors=colors, autopct="%.0f%%", pctdistance=1.1)
plt.title("Industries of employer companies", fontsize=16)
plt.legend(industry["Industry"], loc="upper center", bbox_to_anchor=(0.5, -0.04), ncol=3, fontsize=12)

plt.show()


# In[7]:


fig, axes = plt.subplots(nrows=1, ncols=2, figsize=(15,4))

# create histogram
sns.histplot(
    data["Salary"],
    bins=25,
    kde=True,
    ax=axes[0]
);
axes[0].set_title("Salary distribution", fontsize=16);
axes[0].set_xlabel("Salary ($ per hour/ day)")

# create boxplot
sns.boxplot(
    data["Salary"],
    orient="h",
    width=0.9,
    ax=axes[1]
);
axes[1].set_title("Salary distribution");
axes[1].set_xlabel("Salary ($ per hour)");
axes[1].grid()

data["Salary"].describe()


# From the plotting we find that there are outilers and since there is only 229 rows with values,hence they are removed.

# In[8]:


cols = list(['Job.ID']+['Slug']+['Title']+['Position']+ ['Company']+['City']+['Employment.Type']+['Education.Required']+['Job.Description'])


# In[9]:


data =data[cols]
data.columns = ['Job.ID','Slug', 'Title', 'Position', 'Company','City', 'Empl_type','Edu_req','Job_Description']
data.head()


# In[10]:


data.isnull().sum()


# In[11]:


nan_city = data[pd.isnull(data['City'])]
print(nan_city.shape)
nan_city.head()


# In[12]:


nan_city.groupby(['Company'])['City'].count()


# In[13]:


#Since there are only 9 cities with NaN values we manually replace them


# In[14]:


data['Company'] = data['Company'].replace(['Genesis Health Systems'], 'Genesis Health System')

data.loc[data.Company == 'CHI Payment Systems', 'City'] = 'Illinois'
data.loc[data.Company == 'Academic Year In America', 'City'] = 'Stamford'
data.loc[data.Company == 'CBS Healthcare Services and Staffing ', 'City'] = 'Urbandale'
data.loc[data.Company == 'Driveline Retail', 'City'] = 'Coppell'
data.loc[data.Company == 'Educational Testing Services', 'City'] = 'New Jersey'
data.loc[data.Company == 'Genesis Health System', 'City'] = 'Davennport'
data.loc[data.Company == 'Home Instead Senior Care', 'City'] = 'Nebraska'
data.loc[data.Company == 'St. Francis Hospital', 'City'] = 'New York'
data.loc[data.Company == 'Volvo Group', 'City'] = 'Washington'
data.loc[data.Company == 'CBS Healthcare Services and Staffing', 'City'] = 'Urbandale'


# In[15]:


data.isnull().sum()


# In[16]:


nan_emp_type = data[pd.isnull(data['Empl_type'])]
nan_emp_type.head()


# In[17]:


data['Empl_type']=data['Empl_type'].fillna('Full-Time/Part-Time')
data.groupby(['Empl_type'])['Company'].count()
list(data)


# In[18]:


data.isnull().sum()


# In[19]:


#in the case of education_req,lets look at the values


# In[20]:


import matplotlib.pyplot as plt
import seaborn as sns 


# In[21]:


edu_level = data["Edu_req"].value_counts().reset_index()
edu_level.columns = ["Edu_req", "count"]

#define Seaborn color palette to use
colors = sns.color_palette("pastel")

#create pie chart
plt.figure(facecolor='white', figsize=(6,8))
plt.pie(edu_level["count"], colors = colors, autopct="%.0f%%", pctdistance=1.1)
plt.title("Groups of required education level", fontsize=16)
plt.legend(edu_level["Edu_req"], loc="upper center", bbox_to_anchor=(0.5, -0.04), ncol=3, fontsize=12)

plt.show()


# In[22]:


#Since most of the value is termed as 'not specified' it does not add much value to training of the model. Therefore we drop that feature


# In[23]:


#Now lets look at the job description feature


# In[24]:


cols = list(["Job.ID"]+["Position"]+["Company"]+["City"]+["Empl_type"]+["Job_Description"])
data = data[cols]
data.columns = ["Job.ID", "Job_Position", "City","Company", "Empl_type ", "Job_description"]
display(data.head(2))

data = data.dropna(subset=["Job_description"])
data.shape


# In[25]:


data.isnull().sum()


# In[26]:


duplicate = data[data.duplicated("Job_description")]

print("\nDuplicated rows in Job_description: \n")
display(duplicate.head(3))
print(f"\nNumber of duplicated rows: {duplicate.shape[0]}")


# In[27]:


data = data.drop_duplicates(subset=["Job_description"])
print(f"Total number of rows after deleting duplicates: {data.shape[0]}")


# In[28]:


data.head()


# Text data often comes in different formats, styles, or languages. Cleaning involves standardizing the text by converting it to lowercase, removing accents, and ensuring consistent formatting. This helps in maintaining consistency and improves the generalization of the model.
# 
# Tokenization is the process of breaking down text into individual words or tokens. Cleaning may involve tokenization to prepare the text for further analysis or modeling.
# 
# Stopwords are common words (e.g., "and," "the," "is") that often do not contribute much to the meaning of a text. Cleaning may involve removing stopwords to focus on more meaningful words and improve model efficiency.
# 
# Lemmatization and stemming involve reducing words to their base or root form. Cleaning may include these processes to reduce the dimensionality of the data and ensure that different forms of the same word are treated as identical.

# In[29]:


nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')


# In[30]:


from nltk.corpus import stopwords
import re
import string
from nltk.stem import WordNetLemmatizer
from nltk import word_tokenize
from nltk.corpus import stopwords
stop = stopwords.words('english')
stop_words_ = set(stopwords.words('english'))
wn = WordNetLemmatizer()

def black_txt(token):
    return  token not in stop_words_ and token not in list(string.punctuation)  and len(token)>2   
  
def clean_txt(text):
  clean_text = []
  clean_text2 = []
  text = re.sub("'", "",text)
  text=re.sub("(\\d|\\W)+"," ",text) 
  text = text.replace("nbsp", "")
  clean_text = [ wn.lemmatize(word, pos="v") for word in word_tokenize(text.lower()) if black_txt(word)]
  clean_text2 = [word for word in clean_text if black_txt(word)]
  return " ".join(clean_text2)


# In[31]:


job_data=pd.read_csv("job_data.csv")


# In[32]:


job_data.head()


# In[33]:


job_data.dtypes


# In[34]:


job_data['text'][1]


# In[35]:


job_data['text'][1]


# Lets look at the Experience dataset

# In[36]:


exp=pd.read_csv("Experience.csv")


# In[37]:


exp.head()


# In[38]:


exp.nunique()


# In[39]:


exp.isnull().sum()


# In[40]:


exp.iloc[45]


# In[41]:


exp["Job.Description"] = exp["Job.Description"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)
exp["Position.Name"] = exp["Position.Name"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)
exp["City"] = exp["City"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)


# In[42]:


exp.iloc[45]


# In[43]:


#deleting rows with missing values in Position column and Job,Description column


# In[44]:


exp = exp.dropna(subset=["Job.Description", "Position.Name"])


# In[45]:


cols = list(["Applicant.ID"]+["Position.Name"]+["City"]+["Job.Description"])
exp = exp[cols]
exp.columns = ["Applicant.ID", "Position.Name", "City", "Job.Description"]
exp.head()


# In[46]:


exp.isnull().sum()


# In[47]:


#Lets remove the location feature since it won't help in the recommendation model


# In[48]:


cols = list(["Applicant.ID"]+["Position.Name"]+["City"]+["Job.Description"])
exp = exp[cols]


# In[49]:


#Now let's see the top job positions in the the 'Experience' datasheet 


# In[50]:


top_positions = exp["Position.Name"].value_counts().reset_index()[:10]
top_positions.columns = ["Position.Name", "count"]

sns.barplot(
    x="count",
    y="Position.Name",
    data= top_positions,
    color="blue",
    palette="hls"
).set(title="Top 10 applicant's job positions")

Check for the duplicate values in the job_description column. If their exists, delete them from the datasheet
# In[51]:


duplicate = exp[exp.duplicated("Job.Description")]
duplicate


# In[52]:


print("\nDuplicated rows in Job_description: \n")
display(duplicate.head(3))
print(f"\nNumber of duplicated rows: {duplicate.shape[0]}")


# In[53]:


exp = exp.drop_duplicates(subset=["Job.Description"])
print(f"Total number of rows after deleting duplicates: {exp.shape[0]}")


# In[54]:


import pickle


# #Pickle the datasets that will be used later
# 
# data.to_pickle("data.pkl")
# 
# exp.to_pickle("exp.pkl")

# In[55]:


view=pd.read_csv("Job_Views.csv")


# In[56]:


view.head()


# In[57]:


#In this case we use columns- 'ApplicantID','Job.ID','Position','Company'and 'City'


# In[58]:


view = view[['Applicant.ID', 'Job.ID', 'Position', 'Company','City']]


# In[59]:


#We combine the features into one 1 feature


# In[60]:


view["viewed_details"] = view["Position"].map(str) + "  " + view["Company"]


# In[61]:


view['viewed_details'] = view['viewed_details'].str.lower()
view = view[['Applicant.ID','viewed_details','City']]
view.head()


# In[62]:


view['viewed_details'] = view['viewed_details'].map(str).apply(clean_txt)


# In[63]:


view.head()


# In[64]:


#Since same applicants has mre than one viewed Details, then group them
view = view.groupby('Applicant.ID', sort=False)['viewed_details'].apply(' '.join).reset_index()
view.head()


# Lets Look at the Position_Of_Interest.csv

# In[65]:


poi =  pd.read_csv("Positions_Of_Interest.csv")
poi.head()


# In[66]:


poi = poi.sort_values(by='Applicant.ID')
poi.head()


# In[67]:


#Here we do not require created.At and Updated.At feature.They do not add much relevance to our model. Therefore they are dropped.


# In[68]:


poi = poi[['Applicant.ID', 'Position.Of.Interest']]
poi['Position.Of.Interest']=poi['Position.Of.Interest'].map(str).apply(clean_txt)
poi = poi.fillna(" ")
poi.head()


# In[69]:


#There are are more than one intereset for one applicant, therefore we join them


# In[70]:


poi = poi.groupby('Applicant.ID', sort=True)['Position.Of.Interest'].apply(' '.join).reset_index()
poi.head()


# By now we have completed the data cleaning and analysing of the same.
# 
# We will be combining the five datasets into one whole dataset so that it will be helpful for training the model

# We remove Empl_type and Job_description Since it is present in the 'text' feature of job_data file.

# In[71]:


data=data[['Job.ID','Job_Position','Company','City']]
data.head()


# In[72]:


job_data.head()


# In[73]:


#Merging job_data and data:
recruiter = job_data.merge(data, left_on='Job.ID', right_on='Job.ID', how='outer')
recruiter = recruiter.fillna(' ')
#recruiter = recruiter.sort_values(by='Applicant.ID')
recruiter.head()


# In[74]:


view.head()


# In[75]:


exp['Job.Description']=exp['Job.Description'].map(str).apply(clean_txt)
exp.head()


# In[76]:


merged2 = view.merge(exp, left_on='Applicant.ID', right_on='Applicant.ID', how='outer')
merged2 = merged2.fillna(' ')
#df_jobs_exp = df_jobs_exp.sort_values(by='Applicant.ID')
merged2.head()


# In[77]:


poi.head()


# In[78]:


seeker = merged2.merge(poi, left_on='Applicant.ID', right_on='Applicant.ID', how='outer')
seeker = seeker.fillna(' ')
#seeker = seeker.sort_values(by='Applicant.ID')
seeker.head()


# In[79]:


recruiter.head()


# In[80]:


seeker.head()


# TF-IDF ( Term Frequency - Inverse Document Frequency ).
# 
# This method is also called as Normalization. TF - How many times a particular word appears in a single doc. IDF - This downscales words that appear a lot across documents.

# In[85]:


from sklearn.feature_extraction.text import TfidfVectorizer
tfidf_vectorizer = TfidfVectorizer()

tfidf_jobid = tfidf_vectorizer.fit_transform((recruiter['text'])) #fit and transform text to vector
tfidf_jobid


# In[87]:


u = 326
index = np.where(seeker['Applicant.ID'] == u)[0][0]
user_q = seeker.iloc[[index]]
user_q


# In[89]:


print(list(user_q['Position.Name']))


# In[113]:


from sklearn.metrics.pairwise import cosine_similarity
user_tfidf = tfidf_vectorizer.transform(user_q['Position.Name'])
cos_similarity_tfidf = map(lambda x: cosine_similarity(user_tfidf, x),tfidf_jobid)


# In[114]:


output = list(cos_similarity_tfidf)


# In[116]:


def get_recommendation(top, recruiter, scores):
    recommendation = pd.DataFrame(columns = ['ApplicantID', 'JobID',  'title', 'score'])
    count = 0
    for i in top:
        recommendation.at[count, 'ApplicantID'] = u
        recommendation.at[count, 'JobID'] = recruiter['Job.ID'][i]
        recommendation.at[count, 'title'] = recruiter['Job_Position'][i]
        recommendation.at[count, 'score'] =  scores[count]
        count += 1
    return recommendation


# In[117]:


top = sorted(range(len(output)), key=lambda i: output[i], reverse=True)[:10]
list_scores = [output[i][0][0] for i in top]
get_recommendation(top,recruiter, list_scores)


# In[118]:


from sklearn.feature_extraction.text import CountVectorizer
count_vectorizer = CountVectorizer()

count_jobid = count_vectorizer.fit_transform((recruiter['text'])) #fitting and transforming the vector
count_jobid


# In[119]:


from sklearn.metrics.pairwise import cosine_similarity
user_count = count_vectorizer.transform(user_q['Job.Description'])
cos_similarity_countv = map(lambda x: cosine_similarity(user_count, x),count_jobid)


# In[120]:


output2 = list(cos_similarity_countv)


# In[122]:


top = sorted(range(len(output2)), key=lambda i: output2[i], reverse=True)[:10]
list_scores = [output2[i][0][0] for i in top]
get_recommendation(top, recruiter, list_scores)


# In[ ]:





# In[ ]:




