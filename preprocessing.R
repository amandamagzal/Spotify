# Viz project 2021
# Preprocessing of Spotify data


# Setup -------------------------------------------------------------------

# load library
library(tidyverse)

# get data
dat <- read.csv('SpotifyData.csv')

# select relevant columns and filter to use only songs that have emotions data

df <- dat %>% select(Title, Country, Popularity, Genre_new, 
               anger_norm2, anticipation_norm2, disgust_norm2, 
               fear_norm2, joy_norm2, sadness_norm2, 
               surprise_norm2, trust_norm2) %>%
  filter(!is.na(anger_norm2))



# Radar Chart -------------------------------------------------------------

# reshape the dataframe to have shape: Genre, Emotion (axis), Score (value)
# group by genre and emotion and calculate mean score

radar_data <- df %>% select(Genre_new, anger_norm2, anticipation_norm2, 
              disgust_norm2, fear_norm2, joy_norm2, 
              sadness_norm2, surprise_norm2, trust_norm2) %>%
  pivot_longer(cols = !Genre_new, names_to = 'axis', values_to = 'value') %>% 
  group_by(Genre_new, axis) %>%
  summarise_at(vars(value), mean)


# Barplot -----------------------------------------------------------------

# group by genre and calculate mean popularity

barplot_data <- df %>% 
  select(Popularity, Genre_new) %>% 
  group_by(Genre_new) %>%
  summarise_at(vars(Popularity), mean)


# Boxplot -----------------------------------------------------------------

# function for first quantile
q1 <- function(x){
  return(quantile(x, 0.25))
}

# function for third quantile
q3 <- function(x){
  return(quantile(x, 0.75))
}

# function for lower bound
lower <- function(x){
  return(quantile(x, 0.25) - 1.5*IQR(x))
}

# function for upper bound
upper <- function(x){
  return(quantile(x, 0.75) + 1.5*IQR(x))
}

# group by country and calculate statistics for each emotion

byCountry <- df %>% group_by(Country) %>% 
  select(Country, anger_norm2, anticipation_norm2, disgust_norm2, fear_norm2, 
         joy_norm2, sadness_norm2, surprise_norm2, trust_norm2) %>%
  summarise_all(funs(median, q1, q3, lower, upper))


# get data by country name and emotion

get_boxplot_data <- function(country, emotion){
  
  print(byCountry %>% filter(Country == country) %>% 
    select(starts_with(emotion)) %>%
    pivot_longer(1:5, names_to = 'Metric', values_to = 'Value'))
  
}

# vector of emotions
emotions <- c('anger', 'anticipation', 'joy', 'trust', 
              'fear', 'surprise', 'sadness', 'disgust')

# for loop to print the results
for(i in emotions){
  get_boxplot_data('USA', i)
}


# Map ---------------------------------------------------------------------

# group by country and genre and calculate mean popularity
# get genre with highest popularity

map_data <- df %>% select(Country, Popularity, Genre_new) %>%
  group_by(Country, Genre_new) %>%
  summarise_at(vars(Popularity), mean) %>%
  filter(Popularity == max(Popularity))

# change column names
colnames(map_data) <- c("country", "genre", "pop")

# write data to csv file
write.csv(map_data, 'mapData.csv', row.names = F)


# Word Cloud --------------------------------------------------------------

# select relevant columns and filter to use only songs that have emotions data

df <- dat %>% select(Title, Artist, Uri, Popularity, 
                     Genre_new, trust_norm2) %>%
  filter(!is.na(trust_norm2))

# group by Uri and calculate mean score for emotion and popularity
cloud_data <- df %>% group_by(Uri) %>%
  summarise_at(vars(Popularity, trust_norm2), mean)

# sort data by emotion score and popularity
cloud_data <- cloud_data[order(cloud_data$trust_norm2, cloud_data$Popularity, 
                               decreasing = TRUE),]





