
const fs = require('fs');

const obj = JSON.parse(fs.readFileSync('./tmp/data/bq-tag-posts.json', {encoding: 'utf-8'}));

const tags = {};
obj.forEach(row => {
    if (!tags[row.hashtag]) {
        tags[row.hashtag] = {
            numPosts: parseInt(row.num_posts),
            text: '',
        };
    }
    tags[row.hashtag].text += '\n\n' + row.content;
});

fs.writeFileSync(
    './tmp/data/tag-posts-cat.json',
    JSON.stringify(tags, undefined, 2)
);


