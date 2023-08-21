import { PostItemParams } from './schema/postItemParams';

export namespace Qiita {
  export type User = {
    // description: null;
    // facebook_id: null;
    followees_count: number; // 1
    followers_count: number; // 0
    // github_login_name: null;
    id: string; // 'SAII'
    items_count: number; // 20
    // linkedin_id: null;
    // location: null;
    name: string; // ''
    // organization: null;
    permanent_id: number; // 3293109
    profile_image_url: string; // 'https://lh3.googleusercontent.com/a/AGNmyxY8RF5b6x6bUlbGZOzObSXxwEuOBotjdHYYiyrP=s96-c'
    team_only: boolean; // false
    // twitter_screen_name: null;
    // website_url: null;
  };
  export type Post = {
    rendered_body: string;
    coediting: boolean; // false
    comments_count: number; // 0
    created_at: string; // '2023-08-18T03:11:27+09:00'
    // group: null;
    id: string; // '50238fdb2c56ca12f696'
    likes_count: number; // 0
    private: boolean; // false
    reactions_count: number; // 0
    stocks_count: number; // 0
    // tags: [[Object]];
    title: string; // 'LANの標準規格　37、38';
    updated_at: string; // '2023-08-18T03:11:27+09:00'
    url: string; // 'https://qiita.com/SAII/items/50238fdb2c56ca12f696'
    user: User;
    page_views_count: null;
    team_membership: null;
    organization_url_name: null;
    slide: false;
  };

  export type PostParams = PostItemParams;
}
