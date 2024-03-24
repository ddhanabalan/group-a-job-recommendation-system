#!/usr/bin/env python
# coding: utf-8

# In[103]:


import pandas as pd
import numpy as np
import nltk


# In[104]:


data=pd.read_csv("Combined_Jobs_Final.csv")
data.head()


# In[105]:


data.isnull().sum()


# In[106]:


data.nunique()


# In[107]:


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


# In[108]:


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


# In[109]:


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

# In[110]:


cols = list(['Job.ID']+['Slug']+['Title']+['Position']+ ['Company']+['City']+['Employment.Type']+['Education.Required']+['Job.Description'])


# In[111]:


data =data[cols]
data.columns = ['Job.ID','Slug', 'Title', 'Position', 'Company','City', 'Empl_type','Edu_req','Job_Description']
data.head()


# In[112]:


data.isnull().sum()


# In[113]:


nan_city = data[pd.isnull(data['City'])]
print(nan_city.shape)
nan_city.head()


# In[114]:


nan_city.groupby(['Company'])['City'].count()


# In[115]:


#Since there are only 9 cities with NaN values we manually replace them


# In[116]:


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


# In[117]:


data.isnull().sum()


# In[118]:


nan_emp_type = data[pd.isnull(data['Empl_type'])]
nan_emp_type.head()


# In[119]:


data['Empl_type']=data['Empl_type'].fillna('Full-Time/Part-Time')
data.groupby(['Empl_type'])['Company'].count()
list(data)


# In[120]:


data.isnull().sum()


# In[121]:


#in the case of education_req,lets look at the values


# In[122]:


import matplotlib.pyplot as plt
import seaborn as sns 


# In[123]:


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


# In[124]:


#Since most of the value is termed as 'not specified' it does not add much value to training of the model. Therefore we drop that feature


# In[125]:


#Now lets look at the job description feature


# In[126]:


cols = list(["Job.ID"]+["Position"]+["Company"]+["City"]+["Empl_type"]+["Job_Description"])
data = data[cols]
data.columns = ["Job.ID", "Job_Position", "City","Company", "Empl_type ", "Job_description"]
display(data.head(2))

data = data.dropna(subset=["Job_description"])
data.shape


# In[127]:


data.isnull().sum()


# In[128]:


duplicate = data[data.duplicated("Job_description")]

print("\nDuplicated rows in Job_description: \n")
display(duplicate.head(3))
print(f"\nNumber of duplicated rows: {duplicate.shape[0]}")


# In[129]:


data = data.drop_duplicates(subset=["Job_description"])
print(f"Total number of rows after deleting duplicates: {data.shape[0]}")


# In[130]:


data.head()


# Text data often comes in different formats, styles, or languages. Cleaning involves standardizing the text by converting it to lowercase, removing accents, and ensuring consistent formatting. This helps in maintaining consistency and improves the generalization of the model.
# 
# Tokenization is the process of breaking down text into individual words or tokens. Cleaning may involve tokenization to prepare the text for further analysis or modeling.
# 
# Stopwords are common words (e.g., "and," "the," "is") that often do not contribute much to the meaning of a text. Cleaning may involve removing stopwords to focus on more meaningful words and improve model efficiency.
# 
# Lemmatization and stemming involve reducing words to their base or root form. Cleaning may include these processes to reduce the dimensionality of the data and ensure that different forms of the same word are treated as identical.

# In[131]:


nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')


# In[132]:


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


# In[133]:


job_data=pd.read_csv("job_data.csv")


# In[134]:


job_data.head()


# In[135]:


job_data.dtypes


# In[136]:


job_data['text'][1]


# In[137]:


job_data['text'][1]


# Lets look at the Experience dataset

# In[138]:


exp=pd.read_csv("Experience.csv")


# In[139]:


exp.head()


# In[140]:


exp.nunique()


# In[141]:


exp.isnull().sum()


# In[142]:


exp.iloc[45]


# In[143]:


exp["Job.Description"] = exp["Job.Description"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)
exp["Position.Name"] = exp["Position.Name"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)
exp["City"] = exp["City"].apply(lambda x: x if str(x).lower().replace(' ', '') != "none" and x is not None else np.nan)


# In[144]:


exp.iloc[45]


# In[145]:


#deleting rows with missing values in Position column and Job,Description column


# In[146]:


exp = exp.dropna(subset=["Job.Description", "Position.Name"])


# In[147]:


cols = list(["Applicant.ID"]+["Position.Name"]+["City"]+["Job.Description"])
exp = exp[cols]
exp.columns = ["Applicant.ID", "Position.Name", "City", "Job.Description"]
exp.head()


# In[148]:


exp.isnull().sum()


# In[149]:


#Lets remove the location feature since it won't help in the recommendation model


# In[150]:


cols = list(["Applicant.ID"]+["Position.Name"]+["City"]+["Job.Description"])
exp = exp[cols]


# In[151]:


#Now let's see the top job positions in the the 'Experience' datasheet 


# In[152]:


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
# In[153]:


duplicate = exp[exp.duplicated("Job.Description")]
duplicate


# In[154]:


print("\nDuplicated rows in Job_description: \n")
display(duplicate.head(3))
print(f"\nNumber of duplicated rows: {duplicate.shape[0]}")


# In[155]:


exp = exp.drop_duplicates(subset=["Job.Description"])
print(f"Total number of rows after deleting duplicates: {exp.shape[0]}")


# In[156]:


import pickle


# #Pickle the datasets that will be used later
# 
# data.to_pickle("data.pkl")
# 
# exp.to_pickle("exp.pkl")

# In[157]:


view=pd.read_csv("Job_Views.csv")


# In[158]:


view.head()


# In[159]:


#In this case we use columns- 'ApplicantID','Job.ID','Position','Company'and 'City'


# In[160]:


view = view[['Applicant.ID', 'Job.ID', 'Position', 'Company','City']]


# In[161]:


#We combine the features into one 1 feature


# In[162]:


view["viewed_details"] = view["Position"].map(str) + "  " + view["Company"]


# In[163]:


view['viewed_details'] = view['viewed_details'].str.lower()
view = view[['Applicant.ID','viewed_details','City']]
view.head()


# In[164]:


view['viewed_details'] = view['viewed_details'].map(str).apply(clean_txt)


# In[165]:


view.head()


# In[166]:


#Since same applicants has mre than one viewed Details, then group them
view = view.groupby('Applicant.ID', sort=False)['viewed_details'].apply(' '.join).reset_index()
view.head()


# Lets Look at the Position_Of_Interest.csv

# In[167]:


poi =  pd.read_csv("Positions_Of_Interest.csv")
poi.head()


# In[168]:


poi = poi.sort_values(by='Applicant.ID')
poi.head()


# In[169]:


#Here we do not require created.At and Updated.At feature.They do not add much relevance to our model. Therefore they are dropped.


# In[170]:


poi = poi[['Applicant.ID', 'Position.Of.Interest']]
poi['Position.Of.Interest']=poi['Position.Of.Interest'].map(str).apply(clean_txt)
poi = poi.fillna(" ")
poi.head()


# In[171]:


#There are are more than one intereset for one applicant, therefore we join them


# In[172]:


poi = poi.groupby('Applicant.ID', sort=True)['Position.Of.Interest'].apply(' '.join).reset_index()
poi.head()


# By now we have completed the data cleaning and analysing of the same.
# 
# We will be combining the five datasets into one whole dataset so that it will be helpful for training the model

# We remove Empl_type and Job_description Since it is present in the 'text' feature of job_data file.

# In[173]:


data=data[['Job.ID','Job_Position','Company','City']]
data.head()


# In[174]:


job_data.head()


# In[175]:


#Merging job_data and data:
recruiter = job_data.merge(data, left_on='Job.ID', right_on='Job.ID', how='outer')
recruiter = recruiter.fillna(' ')
#recruiter = recruiter.sort_values(by='Applicant.ID')
recruiter.head()


# In[176]:


view.head()


# In[177]:


exp['Job.Description']=exp['Job.Description'].map(str).apply(clean_txt)
exp.head()


# In[178]:


merged2 = view.merge(exp, left_on='Applicant.ID', right_on='Applicant.ID', how='outer')
merged2 = merged2.fillna(' ')
#df_jobs_exp = df_jobs_exp.sort_values(by='Applicant.ID')
merged2.head()


# In[179]:


poi.head()


# In[180]:


seeker = merged2.merge(poi, left_on='Applicant.ID', right_on='Applicant.ID', how='outer')
seeker = seeker.fillna(' ')
#seeker = seeker.sort_values(by='Applicant.ID')
seeker.head()


# In[181]:


recruiter.head()


# In[182]:


seeker.head()


# In[187]:


seeker.to_pickle("data.pkl")

recruiter.to_pickle("exp.pkl")


# TF-IDF ( Term Frequency - Inverse Document Frequency ).
# 
# This method is also called as Normalization. TF - How many times a particular word appears in a single doc. IDF - This downscales words that appear a lot across documents.

# In[219]:


from sklearn.feature_extraction.text import TfidfVectorizer
tfidf_vectorizer = TfidfVectorizer()

tfidf_jobid = tfidf_vectorizer.fit_transform((seeker['Position.Name'])) #fit and transform text to vector
tfidf_jobid


# In[223]:


indices = pd.Series(seeker.index, index=seeker['Position.Of.Interest']).drop_duplicates()


# In[225]:


def jobs_recommendation(Title, similarity = similarity):
    index = indices[Title]
    similarity_scores = list(enumerate(similarity[index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[::], reverse=True)
    similarity_scores = similarity_scores[0:5]
    newsindices = [i[0] for i in similarity_scores]
    return recruiter[['Job.ID', 'Job_Position', 
                 ]].iloc[newsindices]

jobs_recommendation("security officer")


# In[237]:


u = 111
index = np.where(recruiter['Job.ID'] == u)[0][0]
user_q = recruiter.iloc[[index]]
user_q


# In[238]:


from sklearn.metrics.pairwise import cosine_similarity
user_tfidf = tfidf_vectorizer.transform(user_q['Job_Position'])
cos_similarity_tfidf = map(lambda x: cosine_similarity(user_tfidf, x),tfidf_jobid)


# In[239]:


output = list(cos_similarity_tfidf)


# In[240]:


def get_recommendation(top, seeker, scores):
    recommendation = pd.DataFrame(columns = ['JobID', 'ApplicantID',  'title', 'score'])
    count = 0
    for i in top:
        recommendation.at[count, 'JobID'] = u
        recommendation.at[count, 'JobID'] = seeker['Applicant.ID'][i]
        recommendation.at[count, 'title'] = seeker['Position.Name'][i]
        recommendation.at[count, 'score'] =  scores[count]
        count += 1
    return recommendation


# In[236]:


top = sorted(range(len(output)), key=lambda i: output[i], reverse=True)[:10]
list_scores = [output[i][0][0] for i in top]
get_recommendation(top,seeker, list_scores)


# In[241]:


from sklearn.feature_extraction.text import CountVectorizer
count_vectorizer = CountVectorizer()

count_jobid = count_vectorizer.fit_transform((seeker['viewed_details'])) #fitting and transforming the vector
count_jobid


# In[242]:


from sklearn.metrics.pairwise import cosine_similarity
user_count = count_vectorizer.transform(user_q['text'])
cos_similarity_countv = map(lambda x: cosine_similarity(user_count, x),count_jobid)


# In[243]:


output2 = list(cos_similarity_countv)


# In[244]:


top = sorted(range(len(output2)), key=lambda i: output2[i], reverse=True)[:10]
list_scores = [output2[i][0][0] for i in top]
get_recommendation(top, seeker, list_scores)


# In[ ]:




