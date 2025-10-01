import React, { useState } from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { HeartIcon } from '../components/icons/HeartIcon';

const TopicPage: React.FC<{ postId: number }> = ({ postId }) => {
    const { t, getPostById, getCommentsByPostId, getUserById, user, addComment, navigate, formatDate, toggleLike } = useAppContext();
    const [replyContent, setReplyContent] = useState('');

    const post = getPostById(postId);
    const comments = getCommentsByPostId(postId);
    const author = post ? getUserById(post.userId) : null;

    const handleReplySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (replyContent.trim()) {
            addComment(replyContent, postId);
            setReplyContent('');
        }
    };

    if (!post || !author) {
        return <div className="text-center py-10">{t('topic_not_found')}</div>;
    }
    
    const getRankColor = (rankKey: string) => {
        switch (rankKey) {
            case 'rank_legend': return 'text-red-400';
            case 'rank_master': return 'text-purple-400';
            case 'rank_senior_member': return 'text-cyan-400';
            default: return 'text-gray-400';
        }
    }


    const UserInfo: React.FC<{user: any}> = ({ user }) => (
        <div className="flex-shrink-0 text-center sm:w-32 mb-4 sm:mb-0">
            <img src={`https://i.pravatar.cc/80?u=${user.email}`} alt={user.username} className="w-20 h-20 rounded-full mx-auto mb-2 border-2 border-gray-600" />
            <p className="font-bold text-white">{user.username} {user.isAI && <span className="text-cyan-400 font-bold text-xs">[BOT]</span>}</p>
            <p className={`text-sm font-semibold ${getRankColor(user.rank)}`}>{t(user.rank)}</p>
            <p className="text-sm text-gray-400">{t('level')} {user.level}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-4">
                <a href="#" onClick={(e) => { e.preventDefault(); navigate('forum', { id: post.categoryId })}} className="text-indigo-400 hover:text-indigo-300">&larr; {t('go_back_to_forum')}</a>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

            {/* Original Post */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg mb-6">
                <div className="p-4 flex flex-col sm:flex-row sm:space-x-4">
                    <UserInfo user={author} />
                    <div className="flex-grow sm:border-l sm:border-gray-700 sm:pl-4">
                        <p className="text-xs text-gray-500 mb-2">{t('posted_on', { date: new Date(post.createdAt).toLocaleDateString() })}</p>
                        <p className="text-gray-300 whitespace-pre-wrap text-base">{post.content}</p>
                        {post.source && post.sourceUrl && (
                            <p className="text-xs text-gray-500 mt-4">
                                {t('source')}: <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{post.source}</a>
                            </p>
                        )}
                    </div>
                </div>
                 {user && (
                    <div className="bg-gray-700/50 px-4 py-2 border-t border-gray-700 flex items-center justify-end space-x-4">
                        <span className="text-sm text-gray-400">
                            {post.likes.length > 0 && `${post.likes.length} ${t('likes')}`}
                        </span>
                        <button
                            onClick={() => toggleLike(post.id, 'post')}
                            disabled={user?.id === post.userId}
                            className={`flex items-center space-x-1 text-sm font-semibold transition-colors ${
                                post.likes.includes(user.id) ? 'text-red-500' : 'text-gray-400 hover:text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            aria-label={post.likes.includes(user.id) ? t('unlike') : t('like')}
                        >
                            <HeartIcon filled={post.likes.includes(user.id)} />
                            <span>{post.likes.includes(user.id) ? t('unlike') : t('like')}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Comments */}
            <h2 className="text-2xl font-bold text-white mb-4">{t('replies')} ({comments.length})</h2>
            <div className="space-y-4 mb-6">
                {comments.map(comment => {
                    const commentAuthor = getUserById(comment.userId);
                    if (!commentAuthor) return null;
                    const hasLiked = user ? comment.likes.includes(user.id) : false;
                    return (
                        <div key={comment.id} className="bg-gray-800/70 border border-gray-700 rounded-lg shadow-lg">
                             <div className="p-4 flex flex-col sm:flex-row sm:space-x-4">
                                <UserInfo user={commentAuthor} />
                                <div className="flex-grow sm:border-l sm:border-gray-700 sm:pl-4">
                                    <p className="text-xs text-gray-500 mb-2">{formatDate(comment.createdAt)}</p>
                                    <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                            {user && (
                                <div className="bg-gray-700/50 px-4 py-2 border-t border-gray-700 flex items-center justify-end space-x-4">
                                     <span className="text-sm text-gray-400">
                                        {comment.likes.length > 0 && `${comment.likes.length} ${t('likes')}`}
                                    </span>
                                    <button
                                        onClick={() => toggleLike(comment.id, 'comment')}
                                        disabled={user?.id === comment.userId}
                                        className={`flex items-center space-x-1 text-sm font-semibold transition-colors ${
                                            hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-white'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label={hasLiked ? t('unlike') : t('like')}
                                    >
                                        <HeartIcon filled={hasLiked} />
                                        <span>{hasLiked ? t('unlike') : t('like')}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Reply Form */}
            {user && (
                <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-4">
                    <form onSubmit={handleReplySubmit}>
                        <h3 className="text-xl font-bold text-white mb-2">{t('post_reply')}</h3>
                         <textarea
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder={t('your_message')}
                            className="bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded w-full py-2 px-3 mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            rows={5}
                            required
                        ></textarea>
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors">
                            {t('submit_reply')}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TopicPage;