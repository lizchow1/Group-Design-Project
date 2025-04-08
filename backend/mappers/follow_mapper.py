from db import db
from models.follow_model import Follow
from models.user_model import User
from sqlalchemy.exc import IntegrityError

class FollowMapper:
    
    @staticmethod
    def follow_user(follower_id, followed_id):
        if follower_id == followed_id:
            return {"error": "Users cannot follow themselves"}
            
        try:
            new_follow = Follow(follower_id=follower_id, followed_id=followed_id)
            db.session.add(new_follow)
            db.session.commit()
            return new_follow.to_dict()
        except IntegrityError:
            db.session.rollback()
            return {"error": "Already following this user"}
    
    @staticmethod
    def unfollow_user(follower_id, followed_id):
        follow = Follow.query.filter_by(
            follower_id=follower_id, 
            followed_id=followed_id
        ).first()
        
        if follow:
            db.session.delete(follow)
            db.session.commit()
            return True
        return False
    
    @staticmethod
    def get_followers(user_id, page=1, per_page=20):
        follows = Follow.query.filter_by(followed_id=user_id)\
            .order_by(Follow.created_at.desc())\
            .paginate(page=page, per_page=per_page)
            
        followers = []
        for follow in follows.items:
            follower = User.query.get(follow.follower_id)
            if follower:
                followers.append(follower.to_dict())
                
        return {
            "followers": followers,
            "total": follows.total,
            "pages": follows.pages,
            "current_page": follows.page
        }
    
    @staticmethod
    def get_following(user_id, page=1, per_page=20):
        follows = Follow.query.filter_by(follower_id=user_id)\
            .order_by(Follow.created_at.desc())\
            .paginate(page=page, per_page=per_page)
            
        following = []
        for follow in follows.items:
            followed = User.query.get(follow.followed_id)
            if followed:
                following.append(followed.to_dict())
                
        return {
            "following": following,
            "total": follows.total,
            "pages": follows.pages,
            "current_page": follows.page
        }
    
    @staticmethod
    def is_following(follower_id, followed_id):
        follow = Follow.query.filter_by(
            follower_id=follower_id, 
            followed_id=followed_id
        ).first()
        
        return follow is not None 