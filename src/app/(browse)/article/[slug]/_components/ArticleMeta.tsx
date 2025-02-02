'use client'

import { useAuth } from '@/components/common/AuthProvider'
import Link from 'next/link'
import Image from 'next/image'
import { formatTime } from '@/utils/format'
import FavoriteButton from '@/components/common/FavoriteButton'
import FollowButton from '@/components/common/FollowButton'
import { useRouter } from 'next/navigation'
import { fetchWrapper } from '@/utils/fetch'
import { useArticle } from '@/components/article/ArticleProvider'

const ArticleMeta = () => {
  const { article, setArticle } = useArticle()
  const { currentUser } = useAuth()
  const router = useRouter()

  if (!article) {
    return null
  }

  const isAuthor = currentUser?.id === article.author.id

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you wish to delete the article?')) {
      return
    }

    await fetchWrapper(`/articles/${article.slug}`, 'DELETE')
    router.push('/')
  }

  return (
    <div className="article-meta">
      <Link href={`/@${article.author.username}`}>
        <Image
          src={article.author.image || ''}
          alt={article.author.username}
          width={26}
          height={26}
          className="user-pic"
        />
      </Link>
      <div className="info">
        <Link href={`/@${article.author.username}`} className="author">
          {article.author.username}
        </Link>
        <span className="date">{formatTime(article.updatedAt)}</span>
      </div>
      {isAuthor ? (
        <span>
          <Link href={`/editor/${article.slug}`}>
            <button className="btn btn-sm btn-outline-secondary edit-button mr-1">
              <i className="ion-edit" />
              &nbsp;Edit Article
            </button>
          </Link>

          <button
            className="btn btn-sm btn-outline-danger delete-button"
            onClick={handleDelete}
          >
            <i className="ion-trash-a" />
            &nbsp;Delete Article
          </button>
        </span>
      ) : (
        <span>
          <FollowButton
            author={article.author.username}
            following={article.author.following}
            className={'mr-1'}
            onChange={(profile) => setArticle({ ...article, author: profile })}
          />
          <FavoriteButton
            article={article}
            text="Favorite Article"
            className="btn btn-sm"
            onChange={setArticle}
          />
        </span>
      )}
    </div>
  )
}

export default ArticleMeta
