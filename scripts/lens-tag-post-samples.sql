select *
from (
  select
    src.hashtag, top.num_posts,
    ROW_NUMBER() OVER(PARTITION BY src.hashtag) AS pos,
    src.post_id, posts.content
  from `lens-public-data.polygon.public_hashtag` src
  join (
    select hashtag, count(hashtag_id) as num_posts
    from `lens-public-data.polygon.public_hashtag`
    group by hashtag
    order by count(hashtag_id) desc
    limit 500  -- Top N tags
  ) top
  on src.hashtag = top.hashtag
  join `lens-public-data.polygon.public_profile_post` posts
  on src.post_id = posts.post_id
)
where pos <= 10  -- Num of samples per tag
order by num_posts desc;
