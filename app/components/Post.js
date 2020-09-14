import React from 'react'
import { Link } from 'react-router-dom'
import { useStyletron } from 'baseui'

function Post(props) {
    const post = props.post
    const date = new Date(post.createdDate)
    const dateFormatted = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    const [css, theme] = useStyletron()

    const postListItem = css({
        display: 'block',
        maxWidth: '400px',
        paddingTop: theme.sizing.scale300,
        paddingBottom: theme.sizing.scale300,
        paddingLeft: theme.sizing.scale400,
        paddingRight: theme.sizing.scale400,
        marginBottom: theme.sizing.scale600,
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: theme.colors.borderOpaque,
        ...theme.typography.ParagraphSmall,
        color: theme.colors.primaryA,
        textDecoration: 'none',
        ':last-child': {
            marginBottom: '0'
        }
    })

    const avatarStyle = css({ width: theme.sizing.scale900, verticalAlign: 'middle', marginRight: '10px', borderRadius: '50%', position: 'relative', top: '-1px' })

    return (
        <Link to={`/post/${post._id}`} className={postListItem} onClick={props.onClick}>
            <img src={post.author.avatar} className={avatarStyle} />
            <span>
                <strong>{post.title}</strong> by {post.author.username} <small>on {dateFormatted}</small>
            </span>
        </Link>
    )
}

export default Post
