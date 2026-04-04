import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";

const notifications = [
  { id: 1, image: "/images/friend-req.png", title: "Steve Jobs", text: "posted a link in your timeline.", time: "42 minutes ago" },
  { id: 2, image: "/images/profile-1.png", title: "Admin", text: "updated the name of Freelacer usa.", time: "1 hour ago" },
  { id: 3, image: "/images/friend-req.png", title: "Ryan Roslansky", text: "sent you a connection request.", time: "2 hours ago" },
];

const stories = [
  { id: 1, image: "/images/card_ppl1.png", name: "Your Story" },
  { id: 2, image: "/images/card_ppl2.png", name: "Ryan Roslansky" },
  { id: 3, image: "/images/card_ppl3.png", name: "Dylan Field" },
  { id: 4, image: "/images/card_ppl4.png", name: "Steve Jobs" },
];

const people = [
  { id: 1, image: "/images/people1.png", name: "Steve Jobs", title: "CEO of Apple" },
  { id: 2, image: "/images/people2.png", name: "Ryan Roslansky", title: "CEO of Linkedin" },
  { id: 3, image: "/images/people3.png", name: "Dylan Field", title: "CEO of Figma" },
];

const posts = [
  { id: 1, author: "Karim Saif", avatar: "/images/post_img.png", image: "/images/timeline_img.png", title: "Healthy Tracking App", time: "5 minutes ago", comments: 12, shares: 122, preview: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout." },
  { id: 2, author: "Radovan SkillArena", avatar: "/images/post_img.png", image: "/images/timeline_img.png", title: "Product sprint dashboard", time: "12 minutes ago", comments: 8, shares: 64, preview: "The updated workflow is clearer now and the whole team can follow sprint health at a glance." },
];

const friends = [
  { id: 1, image: "/images/people1.png", name: "Steve Jobs", title: "CEO of Apple", status: "away" },
  { id: 2, image: "/images/people2.png", name: "Ryan Roslansky", title: "CEO of Linkedin", status: "online" },
  { id: 3, image: "/images/people3.png", name: "Dylan Field", title: "CEO of Figma", status: "online" },
];

function preventDefault(event: FormEvent) {
  event.preventDefault();
}

function HomeNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        className="_nav_icon_stroke"
        d="M3 10.5 12 3l9 7.5"
      />
      <path
        className="_nav_icon_stroke"
        d="M5 9.5V20h14V9.5"
      />
      <path
        className="_nav_icon_stroke"
        d="M10 20v-5h4v5"
      />
    </svg>
  );
}

function FriendsNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        className="_nav_icon_stroke"
        d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"
      />
      <path className="_nav_icon_stroke" d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path className="_nav_icon_stroke" d="M21 21v-2a4 4 0 0 0-3-3.87" />
      <path className="_nav_icon_stroke" d="M16.5 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function NotificationsNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        className="_nav_icon_stroke"
        d="M15 17H5.5a1.5 1.5 0 0 1-1.2-2.4L6 12.5V9a6 6 0 1 1 12 0v3.5l1.7 2.1a1.5 1.5 0 0 1-1.2 2.4H19"
      />
      <path className="_nav_icon_stroke" d="M9.5 17a2.5 2.5 0 0 0 5 0" />
    </svg>
  );
}

function MessageNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path
        className="_nav_icon_stroke"
        d="M21 15a3 3 0 0 1-3 3H8l-5 3V6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3Z"
      />
      <path className="_nav_icon_stroke" d="M8 9h8" />
      <path className="_nav_icon_stroke" d="M8 13h5" />
    </svg>
  );
}

export default function Home() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openPostMenuId, setOpenPostMenuId] = useState<number | null>(null);
  const [composerText, setComposerText] = useState("");

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <Link className="navbar-brand" to="/home">
                <img src="/images/logo.svg" alt="Buddy Script" className="_nav_logo" />
              </Link>
            </div>
            <div className="collapse navbar-collapse d-flex align-items-center">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp" onSubmit={preventDefault}>
                  <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" aria-label="Search" />
                </form>
              </div>
              <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                <li className="nav-item _header_nav_item">
                  <Link
                    className="nav-link _header_nav_link _header_nav_link_active"
                    to="/home"
                    aria-label="Home"
                    title="Home"
                  >
                    <span className="_header_nav_link_icon">
                      <HomeNavIcon />
                    </span>
                  </Link>
                </li>
                <li className="nav-item _header_nav_item">
                  <a
                    className="nav-link _header_nav_link"
                    href="#0"
                    aria-label="Friends"
                    title="Friends"
                  >
                    <span className="_header_nav_link_icon">
                      <FriendsNavIcon />
                    </span>
                  </a>
                </li>
                <li className="nav-item _header_nav_item">
                  <button
                    type="button"
                    className={`nav-link _header_nav_link _header_notify_btn border-0 bg-transparent${isNotificationsOpen ? " _header_notify_btn_active" : ""}`}
                    onClick={() => setIsNotificationsOpen((value) => !value)}
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <span className="_header_nav_link_icon">
                      <NotificationsNavIcon />
                    </span>
                    <span className="_counting">{notifications.length}</span>
                    <div className={`_notification_dropdown${isNotificationsOpen ? " show" : ""}`}>
                      <div className="_notifications_content">
                        <h4 className="_notifications_content_title">Notifications</h4>
                      </div>
                      <div className="_notifications_drop_box">
                        <div className="_notifications_all">
                          {notifications.map((item) => (
                            <div key={item.id} className="_notification_box">
                              <div className="_notification_image"><img src={item.image} alt={item.title} className="_notify_img" /></div>
                              <div className="_notification_txt">
                                <p className="_notification_para"><span className="_notify_txt_link">{item.title}</span> {item.text}</p>
                                <div className="_nitification_time"><span>{item.time}</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
                <li className="nav-item _header_nav_item">
                  <a
                    className="nav-link _header_nav_link"
                    href="#0"
                    aria-label="Message"
                    title="Message"
                  >
                    <span className="_header_nav_link_icon">
                      <MessageNavIcon />
                    </span>
                  </a>
                </li>
              </ul>
              <div className="_header_nav_profile">
                <div className="_header_nav_profile_image"><img src="/images/profile.png" alt="Profile" className="_nav_profile_img" /></div>
                <div className="_header_nav_dropdown">
                  <p className="_header_nav_para">Dylan Field</p>
                  <button
                    className={`_header_nav_dropdown_btn _dropdown_toggle${isProfileOpen ? " _header_nav_dropdown_btn_active" : ""}`}
                    type="button"
                    onClick={() => setIsProfileOpen((value) => !value)}
                    aria-label="Open profile menu"
                    title="Profile menu"
                  >
                    <img
                      src="/images/Caretdown.svg"
                      alt=""
                      className="_header_nav_dropdown_icon"
                    />
                  </button>
                </div>
                <div className={`_nav_profile_dropdown _profile_dropdown${isProfileOpen ? " show" : ""}`}>
                  <div className="_nav_profile_dropdown_info">
                    <div className="_nav_profile_dropdown_image"><img src="/images/profile.png" alt="Profile" className="_nav_drop_img" /></div>
                    <div className="_nav_profile_dropdown_info_txt"><h4 className="_nav_dropdown_title">Dylan Field</h4><a href="#0" className="_nav_drop_profile">View Profile</a></div>
                  </div>
                  <hr />
                  <ul className="_nav_dropdown_list">
                    <li className="_nav_dropdown_list_item"><a href="#0" className="_nav_dropdown_link">Settings</a></li>
                    <li className="_nav_dropdown_list_item"><a href="#0" className="_nav_dropdown_link">Help &amp; Support</a></li>
                    <li className="_nav_dropdown_list_item"><Link to="/login" className="_nav_dropdown_link">Log Out</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="_header_mobile_menu">
          <div className="_header_mobile_menu_wrap">
            <div className="container">
              <div className="_header_mobile_menu_top_inner">
                <div className="_header_mobile_menu_logo"><Link to="/home"><img src="/images/logo.svg" alt="Buddy Script" className="_nav_logo" /></Link></div>
                <div className="_header_mobile_menu_right"><a href="#0" className="_header_mobile_search">Search</a></div>
              </div>
            </div>
          </div>
        </div>

        <div className="_mobile_navigation_bottom_wrapper">
          <div className="_mobile_navigation_bottom_wrap">
            <ul className="_mobile_navigation_bottom_list">
              <li className="_mobile_navigation_bottom_item">
                <Link
                  to="/home"
                  className="_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active"
                  aria-label="Home"
                  title="Home"
                >
                  <HomeNavIcon />
                </Link>
              </li>
              <li className="_mobile_navigation_bottom_item">
                <a
                  href="#0"
                  className="_mobile_navigation_bottom_link"
                  aria-label="Friends"
                  title="Friends"
                >
                  <FriendsNavIcon />
                </a>
              </li>
              <li className="_mobile_navigation_bottom_item">
                <a
                  href="#0"
                  className="_mobile_navigation_bottom_link"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <NotificationsNavIcon />
                  <span className="_counting">{notifications.length}</span>
                </a>
              </li>
              <li className="_mobile_navigation_bottom_item">
                <a
                  href="#0"
                  className="_mobile_navigation_bottom_link"
                  aria-label="Message"
                  title="Message"
                >
                  <MessageNavIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
                      <ul className="_left_inner_area_explore_list">
                        <li className="_left_inner_area_explore_item _explore_item"><a href="#0" className="_left_inner_area_explore_link">Learning</a> <span className="_left_inner_area_explore_link_txt">New</span></li>
                        <li className="_left_inner_area_explore_item"><a href="#0" className="_left_inner_area_explore_link">Insights</a></li>
                        <li className="_left_inner_area_explore_item"><a href="#0" className="_left_inner_area_explore_link">Find friends</a></li>
                        <li className="_left_inner_area_explore_item"><a href="#0" className="_left_inner_area_explore_link">Bookmarks</a></li>
                      </ul>
                    </div>
                  </div>
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_left_inner_area_suggest_content _mar_b24"><h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4></div>
                      {people.map((person) => (
                        <div key={person.id} className="_left_inner_area_suggest_info">
                          <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image"><a href="#0"><img src={person.image} alt={person.name} className="_info_img1" /></a></div>
                            <div className="_left_inner_area_suggest_info_txt"><a href="#0"><h4 className="_left_inner_area_suggest_info_title">{person.name}</h4></a><p className="_left_inner_area_suggest_info_para">{person.title}</p></div>
                          </div>
                          <div className="_left_inner_area_suggest_info_link"><a href="#0" className="_info_link">Connect</a></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">
                    <div className="_feed_inner_ppl_card _mar_b16">
                      <div className="row">
                        {stories.map((story) => (
                          <div key={story.id} className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                            <div className={`${story.id === 1 ? "_feed_inner_profile_story" : "_feed_inner_public_story"} _b_radious6`}>
                              <div className={story.id === 1 ? "_feed_inner_profile_story_image" : "_feed_inner_public_story_image"}>
                                <img src={story.image} alt={story.name} className={story.id === 1 ? "_profile_story_img" : "_public_story_img"} />
                                <div className={story.id === 1 ? "_feed_inner_story_txt" : "_feed_inner_pulic_story_txt"}>
                                  <p className={story.id === 1 ? "_feed_inner_story_para" : "_feed_inner_pulic_story_para"}>{story.name}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
                      <div className="_feed_inner_text_area_box">
                        <div className="_feed_inner_text_area_box_image"><img src="/images/txt_img.png" alt="Profile" className="_txt_img" /></div>
                        <div className="form-floating _feed_inner_text_area_box_form">
                          <textarea className="form-control _textarea" placeholder="Leave a comment here" id="floatingTextarea" value={composerText} onChange={(event) => setComposerText(event.target.value)} />
                          <label className="_feed_textarea_label" htmlFor="floatingTextarea">Write something ...</label>
                        </div>
                      </div>
                      <div className="_feed_inner_text_area_bottom">
                        <div className="_feed_inner_text_area_item">
                          <div className="_feed_inner_text_area_bottom_photo _feed_common"><button type="button" className="_feed_inner_text_area_bottom_photo_link">Photo</button></div>
                          <div className="_feed_inner_text_area_bottom_video _feed_common"><button type="button" className="_feed_inner_text_area_bottom_photo_link">Video</button></div>
                          <div className="_feed_inner_text_area_bottom_event _feed_common"><button type="button" className="_feed_inner_text_area_bottom_photo_link">Event</button></div>
                          <div className="_feed_inner_text_area_bottom_article _feed_common"><button type="button" className="_feed_inner_text_area_bottom_photo_link">Article</button></div>
                        </div>
                        <div className="_feed_inner_text_area_btn"><button type="button" className="_feed_inner_text_area_btn_link"><span>Post</span></button></div>
                      </div>
                    </div>

                    {posts.map((post) => (
                      <div key={post.id} className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <div className="_feed_inner_timeline_post_top">
                            <div className="_feed_inner_timeline_post_box">
                              <div className="_feed_inner_timeline_post_box_image"><img src={post.avatar} alt={post.author} className="_post_img" /></div>
                              <div className="_feed_inner_timeline_post_box_txt"><h4 className="_feed_inner_timeline_post_box_title">{post.author}</h4><p className="_feed_inner_timeline_post_box_para">{post.time} . <a href="#0">Public</a></p></div>
                            </div>
                            <div className="_feed_inner_timeline_post_box_dropdown">
                              <div className="_feed_timeline_post_dropdown"><button type="button" className="_feed_timeline_post_dropdown_link" onClick={() => setOpenPostMenuId((value) => (value === post.id ? null : post.id))}>Menu</button></div>
                              <div className={`_feed_timeline_dropdown _timeline_dropdown${openPostMenuId === post.id ? " show" : ""}`}>
                                <ul className="_feed_timeline_dropdown_list">
                                  <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Save Post</a></li>
                                  <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Turn On Notification</a></li>
                                  <li className="_feed_timeline_dropdown_item"><a href="#0" className="_feed_timeline_dropdown_link">Hide</a></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <h4 className="_feed_inner_timeline_post_title">-{post.title}</h4>
                          <div className="_feed_inner_timeline_image"><img src={post.image} alt={post.title} className="_time_img" /></div>
                        </div>
                        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                          <div className="_feed_inner_timeline_total_reacts_image"><img src="/images/react_img1.png" alt="react" className="_react_img1" /><img src="/images/react_img2.png" alt="react" className="_react_img" /><p className="_feed_inner_timeline_total_reacts_para">9+</p></div>
                          <div className="_feed_inner_timeline_total_reacts_txt"><p className="_feed_inner_timeline_total_reacts_para1"><a href="#0"><span>{post.comments}</span> Comment</a></p><p className="_feed_inner_timeline_total_reacts_para2"><span>{post.shares}</span> Share</p></div>
                        </div>
                        <div className="_feed_inner_timeline_reaction">
                          <button type="button" className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active"><span className="_feed_inner_timeline_reaction_link">Haha</span></button>
                          <button type="button" className="_feed_inner_timeline_reaction_comment _feed_reaction"><span className="_feed_inner_timeline_reaction_link">Comment</span></button>
                          <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction"><span className="_feed_inner_timeline_reaction_link">Share</span></button>
                        </div>
                        <div className="_feed_inner_timeline_cooment_area">
                          <div className="_feed_inner_comment_box">
                            <form className="_feed_inner_comment_box_form" onSubmit={preventDefault}>
                              <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image"><img src="/images/comment_img.png" alt="Comment" className="_comment_img" /></div>
                                <div className="_feed_inner_comment_box_content_txt"><textarea className="form-control _comment_textarea" placeholder="Write a comment" /></div>
                              </div>
                            </form>
                          </div>
                        </div>
                        <div className="_timline_comment_main">
                          <div className="_previous_comment"><button type="button" className="_previous_comment_txt">View 4 previous comments</button></div>
                          <div className="_comment_main">
                            <div className="_comment_image"><a href="#0" className="_comment_image_link"><img src="/images/txt_img.png" alt="Comment avatar" className="_comment_img1" /></a></div>
                            <div className="_comment_area"><div className="_comment_details"><div className="_comment_details_top"><div className="_comment_name"><a href="#0"><h4 className="_comment_name_title">Radovan SkillArena</h4></a></div></div><div className="_comment_status"><p className="_comment_status_text"><span>{post.preview}</span></p></div></div></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">
                  <div className="_layout_right_sidebar_inner">
                    <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_right_inner_area_info_content _mar_b24"><h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4></div>
                      <hr className="_underline" />
                      <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box"><div className="_right_inner_area_info_box_image"><a href="#0"><img src="/images/Avatar.png" alt="Radovan SkillArena" className="_ppl_img" /></a></div><div className="_right_inner_area_info_box_txt"><a href="#0"><h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4></a><p className="_right_inner_area_info_box_para">Founder &amp; CEO at Trophy</p></div></div>
                        <div className="_right_info_btn_grp"><button type="button" className="_right_info_btn_link">Ignore</button><button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button></div>
                      </div>
                    </div>
                  </div>

                  <div className="_layout_right_sidebar_inner">
                    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_feed_top_fixed"><div className="_feed_right_inner_area_card_content _mar_b24"><h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4></div></div>
                      <div className="_feed_bottom_fixed">
                        {friends.map((friend) => (
                          <div key={friend.id} className={`_feed_right_inner_area_card_ppl${friend.status === "away" ? " _feed_right_inner_area_card_ppl_inactive" : ""}`}>
                            <div className="_feed_right_inner_area_card_ppl_box"><div className="_feed_right_inner_area_card_ppl_image"><a href="#0"><img src={friend.image} alt={friend.name} className="_box_ppl_img" /></a></div><div className="_feed_right_inner_area_card_ppl_txt"><a href="#0"><h4 className="_feed_right_inner_area_card_ppl_title">{friend.name}</h4></a><p className="_feed_right_inner_area_card_ppl_para">{friend.title}</p></div></div>
                            <div className="_feed_right_inner_area_card_ppl_side">{friend.status === "online" ? <span>Online</span> : <span>5 minute ago</span>}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
