import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { Post } from "@/types/post";
import { useAppSelector } from "@/redux/hooks";
import { Link } from "react-router-dom";

const notifications = [
  {
    id: 1,
    image: "/images/friend-req.png",
    title: "Steve Jobs",
    text: "posted a link in your timeline.",
    time: "42 minutes ago",
  },
  {
    id: 2,
    image: "/images/profile-1.png",
    title: "Admin",
    text: "updated the name of Freelacer usa.",
    time: "1 hour ago",
  },
  {
    id: 3,
    image: "/images/friend-req.png",
    title: "Ryan Roslansky",
    text: "sent you a connection request.",
    time: "2 hours ago",
  },
];

const stories = [
  {
    id: 1,
    image: "/images/card_ppl1.png",
    avatar: "/images/profile.png",
    name: "Your Story",
    isOwnStory: true,
  },
  {
    id: 2,
    image: "/images/card_ppl2.png",
    avatar: "/images/people2.png",
    name: "Ryan Roslansky",
    isOwnStory: false,
  },
  {
    id: 3,
    image: "/images/card_ppl3.png",
    avatar: "/images/people3.png",
    name: "Dylan Field",
    isOwnStory: false,
  },
  {
    id: 4,
    image: "/images/card_ppl4.png",
    avatar: "/images/people1.png",
    name: "Steve Jobs",
    isOwnStory: false,
  },
];

const moreStories = [{ id: 5, name: "More Stories" }];

const people = [
  {
    id: 1,
    image: "/images/people1.png",
    name: "Steve Jobs",
    title: "CEO of Apple",
  },
  {
    id: 2,
    image: "/images/people2.png",
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
  },
  {
    id: 3,
    image: "/images/people3.png",
    name: "Dylan Field",
    title: "CEO of Figma",
  },
];

const friends = [
  {
    id: 1,
    image: "/images/people1.png",
    name: "Steve Jobs",
    title: "CEO of Apple",
    status: "away",
  },
  {
    id: 2,
    image: "/images/people2.png",
    name: "Ryan Roslansky",
    title: "CEO of Linkedin",
    status: "online",
  },
  {
    id: 3,
    image: "/images/people3.png",
    name: "Dylan Field",
    title: "CEO of Figma",
    status: "online",
  },
];

function preventDefault(event: FormEvent) {
  event.preventDefault();
}

function formatRelativeTime(dateValue: string) {
  const targetDate = new Date(dateValue);

  if (Number.isNaN(targetDate.getTime())) {
    return dateValue;
  }

  const diffInSeconds = Math.max(
    1,
    Math.floor((Date.now() - targetDate.getTime()) / 1000),
  );

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const minutes = Math.floor(diffInSeconds / 60);

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return targetDate.toLocaleDateString();
}

function HomeNavIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <path className="_nav_icon_stroke" d="M3 10.5 12 3l9 7.5" />
      <path className="_nav_icon_stroke" d="M5 9.5V20h14V9.5" />
      <path className="_nav_icon_stroke" d="M10 20v-5h4v5" />
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
      <path
        className="_nav_icon_stroke"
        d="M9.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
      />
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

function PhotoComposerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        fill="#666"
        d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z"
      />
    </svg>
  );
}

function VideoComposerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="24"
      fill="none"
      viewBox="0 0 22 24"
    >
      <path
        fill="#666"
        d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z"
      />
    </svg>
  );
}

function EventComposerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="24"
      fill="none"
      viewBox="0 0 22 24"
    >
      <path
        fill="#666"
        d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698zm3.546 8.283H4.004l.001 6.621c0 2.325 1.137 3.616 3.183 3.697l.207.004h7.132c2.184 0 3.39-1.271 3.39-3.63v-6.692zm-3.202 5.853c.349 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.237-.645.546-.692l.094-.006zm-3.742 0c.35 0 .632.312.632.698 0 .353-.238.645-.546.691l-.086.006c-.357 0-.64-.312-.64-.697 0-.354.238-.645.546-.692l.094-.006zm-3.75 0c.35 0 .633.312.633.698 0 .353-.238.645-.547.691l-.093.006c-.35 0-.633-.312-.633-.697 0-.354.238-.645.547-.692l.094-.006zm7.492-3.615c.349 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.237-.645.546-.691l.094-.006zm-3.742 0c.35 0 .632.312.632.697 0 .354-.238.645-.546.692l-.086.006c-.357 0-.64-.312-.64-.698 0-.353.238-.645.546-.691l.094-.006zm-3.75 0c.35 0 .633.312.633.697 0 .354-.238.645-.547.692l-.093.006c-.35 0-.633-.312-.633-.698 0-.353.238-.645.547-.691l.094-.006zm6.515-7.657H8.192v.895c0 .385-.283.698-.633.698-.32 0-.584-.263-.626-.603l-.006-.095v-.874c-1.886.173-2.922 1.422-2.922 3.6v.402h13.912v-.403c.007-2.181-1.024-3.427-2.914-3.599v.874c0 .385-.283.698-.632.698-.32 0-.585-.263-.627-.603l-.005-.095v-.895z"
      />
    </svg>
  );
}

function ArticleComposerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="20"
      fill="none"
      viewBox="0 0 18 20"
    >
      <path
        fill="#666"
        d="M12.49 0c2.92 0 4.665 1.92 4.693 5.132v9.659c0 3.257-1.75 5.209-4.693 5.209H5.434c-.377 0-.734-.032-1.07-.095l-.2-.041C2 19.371.74 17.555.74 14.791V5.209c0-.334.019-.654.055-.96C1.114 1.564 2.799 0 5.434 0h7.056zm-.008 1.457H5.434c-2.244 0-3.381 1.263-3.381 3.752v9.582c0 2.489 1.137 3.752 3.38 3.752h7.049c2.242 0 3.372-1.263 3.372-3.752V5.209c0-2.489-1.13-3.752-3.372-3.752zm-.239 12.053c.36 0 .652.324.652.724 0 .4-.292.724-.652.724H5.656c-.36 0-.652-.324-.652-.724 0-.4.293-.724.652-.724h6.587zm0-4.239a.643.643 0 01.632.339.806.806 0 010 .78.643.643 0 01-.632.339H5.656c-.334-.042-.587-.355-.587-.729s.253-.688.587-.729h6.587zM8.17 5.042c.335.041.588.355.588.729 0 .373-.253.687-.588.728H5.665c-.336-.041-.589-.355-.589-.728 0-.374.253-.688.589-.729H8.17z"
      />
    </svg>
  );
}

function PostComposerIcon() {
  return (
    <svg
      className="_mar_img"
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="13"
      fill="none"
      viewBox="0 0 14 13"
    >
      <path
        fill="#fff"
        fill-rule="evenodd"
        d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z"
        clip-rule="evenodd"
      />
    </svg>
  );
}

function PenComposerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      className="_feed_textarea_label_icon"
    >
      <path
        d="M12 20h9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M16.5 3.5a2.12 2.12 0 1 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openPostMenuId, setOpenPostMenuId] = useState<string | null>(null);
  const [composerText, setComposerText] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [composerError, setComposerError] = useState("");
  const [composerSuccess, setComposerSuccess] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // useEffect(() => {
  //   let ignore = false;

  //   const fetchPosts = async () => {
  //     try {
  //       setFeedError("");
  //       const response = await fetch("/api/posts");
  //       const data = await response.json();

  //       if (!response.ok) {
  //         throw new Error(data.message || "Failed to fetch posts");
  //       }

  //       if (!ignore) {
  //         setPosts(Array.isArray(data.posts) ? data.posts : []);
  //       }
  //     } catch (error) {
  //       if (!ignore) {
  //         setFeedError(
  //           error instanceof Error
  //             ? error.message
  //             : "Failed to fetch posts",
  //         );
  //       }
  //     } finally {
  //       if (!ignore) {
  //         setIsLoadingPosts(false);
  //       }
  //     }
  //   };

  //   fetchPosts();

  //   return () => {
  //     ignore = true;
  //   };
  // }, []);

  useEffect(() => {
    return () => {
      if (selectedImagePreview) {
        URL.revokeObjectURL(selectedImagePreview);
      }
    };
  }, [selectedImagePreview]);

  const clearSelectedImage = () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    setSelectedImage(null);
    setSelectedImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePhotoSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setComposerError("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    setComposerError("");

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
    }

    setSelectedImage(file);
    setSelectedImagePreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?._id) {
      setComposerError("You must be logged in to create a post.");
      return;
    }

    const trimmedText = composerText.trim();

    if (!trimmedText) {
      setComposerError("Write something before posting.");
      return;
    }

    try {
      setIsSubmittingPost(true);
      setComposerError("");
      setComposerSuccess("");

      const formData = new FormData();
      formData.append("authorId", user._id);
      formData.append("title", trimmedText);
      formData.append("visibility", "Public");

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create post");
      }

      setPosts((currentPosts) => [data.post as Post, ...currentPosts]);
      setComposerText("");
      clearSelectedImage();
      setComposerSuccess("Post created successfully.");
    } catch (error) {
      setComposerError(
        error instanceof Error
          ? error.message
          : "Failed to create post",
      );
    } finally {
      setIsSubmittingPost(false);
    }
  };

  return (
    <div className="_layout _layout_main_wrapper">
      <div className="_main_layout">
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <Link className="navbar-brand" to="/">
                <img
                  src="/images/logo.svg"
                  alt="Buddy Script"
                  className="_nav_logo"
                />
              </Link>
            </div>
            <div className="collapse navbar-collapse d-flex align-items-center">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp" onSubmit={preventDefault}>
                  <input
                    className="form-control me-2 _inpt1"
                    type="search"
                    placeholder="input search text"
                    aria-label="Search"
                  />
                </form>
              </div>
              <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                <li className="nav-item _header_nav_item">
                  <Link
                    className="nav-link _header_nav_link _header_nav_link_active"
                    to="/"
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
                    <div
                      className={`_notification_dropdown${isNotificationsOpen ? " show" : ""}`}
                    >
                      <div className="_notifications_content">
                        <h4 className="_notifications_content_title">
                          Notifications
                        </h4>
                        <div className="_notification_box_right">
                          <button
                            type="button"
                            className="_notification_box_right_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="4"
                              height="17"
                              fill="none"
                              viewBox="0 0 4 17"
                            >
                              <circle
                                cx="2"
                                cy="2"
                                r="2"
                                fill="#C4C4C4"
                              ></circle>
                              <circle
                                cx="2"
                                cy="8"
                                r="2"
                                fill="#C4C4C4"
                              ></circle>
                              <circle
                                cx="2"
                                cy="15"
                                r="2"
                                fill="#C4C4C4"
                              ></circle>
                            </svg>
                          </button>
                          <div className="_notifications_drop_right">
                            <ul className="_notification_list">
                              <li className="_notification_item">
                                <span className="_notification_link">
                                  Mark as all read
                                </span>
                              </li>
                              <li className="_notification_item">
                                <span className="_notification_link">
                                  Notifivations seetings
                                </span>
                              </li>
                              <li className="_notification_item">
                                <span className="_notification_link">
                                  Open Notifications
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="_notifications_drop_box">
                        <div className="_notifications_drop_btn_grp">
                          <button className="_notifications_btn_link">
                            All
                          </button>
                          <button className="_notifications_btn_link1">
                            Unread
                          </button>
                        </div>
                        <div className="_notifications_all">
                          {notifications.map((item) => (
                            <div key={item.id} className="_notification_box">
                              <div className="_notification_image">
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="_notify_img"
                                />
                              </div>
                              <div className="flex flex-col items-start">
                                <p className="_notification_para">
                                  <span className="_notify_txt_link">
                                    {item.title}
                                  </span>{" "}
                                  {item.text}
                                </p>
                                <div className="_nitification_time">
                                  <span>{item.time}</span>
                                </div>
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
                <div className="_header_nav_profile_image">
                  <img
                    src="/images/profile.png"
                    alt="Profile"
                    className="_nav_profile_img"
                  />
                </div>
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
                <div
                  className={`_nav_profile_dropdown _profile_dropdown${isProfileOpen ? " show" : ""}`}
                >
                  <div className="_nav_profile_dropdown_info">
                    <div className="_nav_profile_dropdown_image">
                      <img
                        src="/images/profile.png"
                        alt="Profile"
                        className="_nav_drop_img"
                      />
                    </div>
                    <div className="_nav_profile_dropdown_info_txt">
                      <h4 className="_nav_dropdown_title">Dylan Field</h4>
                      <a href="#0" className="_nav_drop_profile">
                        View Profile
                      </a>
                    </div>
                  </div>
                  <hr />
                  <ul className="_nav_dropdown_list">
                    <li className="_nav_dropdown_list_item">
                      <a href="#0" className="_nav_dropdown_link">
                        Settings
                      </a>
                    </li>
                    <li className="_nav_dropdown_list_item">
                      <a href="#0" className="_nav_dropdown_link">
                        Help &amp; Support
                      </a>
                    </li>
                    <li className="_nav_dropdown_list_item">
                      <Link to="/login" className="_nav_dropdown_link">
                        Log Out
                      </Link>
                    </li>
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
                <div className="_header_mobile_menu_logo">
                  <Link to="/">
                    <img
                      src="/images/logo.svg"
                      alt="Buddy Script"
                      className="_nav_logo"
                    />
                  </Link>
                </div>
                <div className="_header_mobile_menu_right">
                  <a href="#0" className="_header_mobile_search">
                    Search
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="_mobile_navigation_bottom_wrapper">
          <div className="_mobile_navigation_bottom_wrap">
            <ul className="_mobile_navigation_bottom_list">
              <li className="_mobile_navigation_bottom_item">
                <Link
                  to="/"
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
                      <h4 className="_left_inner_area_explore_title _title5 _mar_b24">
                        Explore
                      </h4>
                      <ul className="_left_inner_area_explore_list">
                        <li className="_left_inner_area_explore_item _explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="none"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fill="#666"
                                d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14zm.14 1.467l-.027.126-.034.１９８c-.07.483-.１１２ １.２３３-.１１１ ２.０３６l.００１.２７９c.００９.７３７.０５３ １.４１４.１２３ １.８４１l.０４８.２３５.１９２-.０７c.８８３-.３７２ ２.６３６-１.５６ ３.２３-２．２l.０８ -.０８７ -.２１２ -.２１８c -.７１１ -.６８２ -２．３８ -１．７９ -３．１６７ -２．０９５l -.１２４ -.０４５z"
                              />
                            </svg>
                            Learning
                          </a>{" "}
                          <span className="_left_inner_area_explore_link_txt">
                            New
                          </span>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="none"
                              viewBox="0 0 22 24"
                            >
                              <path
                                fill="#666"
                                d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm0 1.395H6.988c-2.37 0-3.883 1.774-3.883 4.498v8.214c0 2.727 1.507 4.498 3.883 4.498h7.972c2.375 0 3.883-1.77 3.883-4.498V7.893c0-2.727-1.508-4.498-3.883-4.498zM7.036 9.63c.323 0 .59.263.633.604l.005.094v6.382c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-6.382c0-.385.286-.697.638-.697zm3.97-3.053c.323 0 .59.262.632.603l.006.095v9.435c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094V7.274c0-.386.286-.698.638-.698zm3.905 6.426c.323 0 .59.262.632.603l.006.094v3.01c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-3.01c0-.385.286-.697.638-.697z"
                              />{" "}
                            </svg>
                            Insights
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="find-friends.html"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="none"
                              viewBox="0 0 22 24"
                            >
                              <path
                                fill="#666"
                                d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm0 1.5l-.308.002c-3.645.038-5.523.764-5.523 2.157 0 1.44 1.99 2.18 5.831 2.18 3.847 0 5.832-.728 5.832-2.159 0-1.44-1.99-2.18-5.832-2.18zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2zm0 1.5c-1.94 0-3.491 1.697-3.491 3.819 0 2.12 1.552 3.818 3.491 3.818 1.94 0 3.492-1.697 3.492-3.818 0-2.122-1.551-3.818-3.492-3.818z"
                              />
                            </svg>
                            Find friends
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="none"
                              viewBox="0 0 22 24"
                            >
                              <path
                                fill="#666"
                                d="M13.704 2c2.8 0 4.585 1.435 4.585 4.258V20.33c0 .443-.157.867-.436 1.18-.279.313-.658.489-1.063.489a1.456 1.456 0 01-.708-.203l-5.132-3.134-5.112 3.14c-.615.36-1.361.194-1.829-.405l-.09-.126-.085-.155a1.913 1.913 0 01-.176-.786V6.434C3.658 3.5 5.404 2 8.243 2h5.46zm0 1.448h-5.46c-2.191 0-3.295.948-3.295 2.986V20.32c0 .044.01.088 0 .07l.034.063c.059.09.17.12.247.074l5.11-3.138c.38-.23.84-.23 1。222.001l5。124 3。128a。252。252 0 00。１１４。０３５。１８８。１８８ ０ ００。１４−。０６４。２３６。２３６ ０ ００。０５８−。１５７V６。２５８c０−１。９−１。１３２−２。８１−３。２９４−２。８１zm。３８６ ４。８６９c。３５７ ０ 。６４６ 。３２４ 。６４６ 。７２３ ０ 。３６７−。２４３ 。６７−。５５９ 。７１８l−。０８７ 。００６H７。８１c−。３５７ ０−。６４６ −。３２４−。６４６ −。７２３ ０−。３６７ 。２４３ −。６７ 。５５８ −。７１８l 。０８８ −。００６h６。２８z"
                              />
                            </svg>
                            Bookmarks
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="group.html"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#666"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="feather feather-users"
                            >
                              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="9" cy="7" r="4"></circle>
                              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                            Group
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item _explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="none"
                              viewBox="0 0 22 24"
                            >
                              <path
                                fill="#666"
                                d="M7.625 2c.315-.015.642.306.645.69.003.309.234.558.515.558h.928c1.317 0 2.402 1.169 2.419 2.616v.24h2.604c2.911-.026 5.255 2.337 5.377 5.414.005.12.006.245.004.368v4.31c.062 3.108-2.21 5.704-5.064 5.773-.117.003-.228 0-.34-.005a199.325 199.325 0 01-7.516 0c-2.816.132-5.238-2.292-5.363-5.411a6.262 6.262 0 01-.004-.371V11.87c-.03-1.497.48-2.931 1.438-4.024.956-1.094 2.245-1.714 3.629-1.746a3.28 3.28 0 01.342.005l3.617-.001v-.231c-.008-.676-.522-1.23-1.147-1.23h-.93c-.973 0-1.774-.866-1.785-1.937-.003-.386.28-.701.631-.705zm-.614 5.494h-.084C5.88 7.52 4.91 7.987 4.19 8.812c-.723.823-1.107 1.904-1.084 3.045v4.34c-.002.108 0 .202.003.294.094 2.353 1.903 4.193 4.07 4.08 2.487.046 5.013.046 7.55-.001.124.006.212.007.3.004 2.147-.05 3.86-2.007 3.812-4.361V11.87a5.027 5.027 0 00-.002-.291c-.093-2.338-1.82-4.082-4.029-4.082l-.07.002H7.209a4.032 4.032 0 00-.281-.004l.084-.001zm1.292 4.091c.341 0 .623.273.667.626l.007.098-.001 1.016h.946c.372 0 .673.325.673.725 0 .366-.253.669-.582.717l-.091.006h-.946v1.017c0 .4-.3.724-.673.724-.34 0-.622-.273-.667-.626l-.006-.098v-1.017h-.945c-.372 0-.674-.324-.674-.723 0-.367.254-.67.582-.718l.092-.006h.945v-1.017c0-.4.301-.724.673-.724zm7.058 3.428c.372 0 .674.324.674.724 0 .366-.254.67-.582.717l-.091.007h-.09c-.373 0-.674-.324-.674-.724 0-.367.253-.67.582-.717l.091-.007h.09zm-1.536-3.322c.372 0 .673.324.673.724 0 .367-.253.67-.582.718l-.091.006h-.09c-.372 0-.674-.324-.674-.724 0-.366.254-.67.582-.717l.092-.007h.09z"
                              />
                            </svg>
                            Gaming
                          </a>{" "}
                          <span className="_left_inner_area_explore_link_txt">
                            New
                          </span>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#666"
                                d="M12.616 2c.71 0 1.388.28 1.882.779.495.498.762 1.17.74 1.799l.009.147c.017.146.065.286.144.416.152.255.402.44.695.514.292.074.602.032.896-.137l.164-.082c1.23-.567 2.705-.117 3.387 1.043l.613 1.043c.017.027.03.056.043.085l.057.111a2.537 2.537 0 01-.884 3.204l-.257.159a1.102 1.102 0 00-.33.356 1.093 1.093 0 00-.117.847c.078.287.27.53.56.695l.166.105c.505.346.869.855 1.028 1.439.18.659.083 1.36-.272 1.957l-.66 1.077-.1.152c-.774 1.092-2.279 1.425-3.427.776l-.136-.069a1.19 1.19 0 00-.435-.1 1.128 1.128 0 00-1.143 1.154l-.008.171C15.12 20.971 13.985 22 12.616 22h-1.235c-1.449 0-2.623-1.15-2.622-2.525l-.008-.147a1.045 1.045 0 00-.148-.422 1.125 1.125 0 00-.688-.519c-.29-.076-.6-.035-.9.134l-.177.087a2.674 2.674 0 01-1.794.129 2.606 2.606 0 01-1.57-1.215l-.637-1.078-.085-.16a2.527 2.527 0 011.03-3.296l.104-.065c.309-.21.494-.554.494-.923 0-.401-.219-.772-.6-.989l-.156-.097a2.542 2.542 0 01-.764-3.407l.65-1.045a2.646 2.646 0 013.552-.96l.134.07c.135.06.283.093.425.094.626 0 1.137-.492 1.146-1.124l.009-.194a2.54 2.54 0 01.752-1.593A2.642 2.642 0 0111.381 2h1.235zm0 1.448h-1.235c-.302 0-.592.118-.806.328a1.091 1.091 0 00-.325.66l-.013.306C10.133 6.07 9 7.114 7.613 7.114a2.619 2.619 0 01-1.069-.244l-.192-.1a1.163 1.163 0 00-1.571.43l-.65 1.045a1.103 1.103 0 00.312 1.464l.261.162A2.556 2.556 0 015.858 12c0 .845-.424 1.634-1.156 2.13l-.156.096c-.512.29-.71.918-.472 1.412l.056.107.63 1.063c.147.262.395.454.688.536.26.072.538.052.754-.042l.109-.052a2.652 2.652 0 011.986-.261 2.591 2.591 0 011.925 2.21l.02.353c.062.563.548 1 1.14 1h1.234c.598 0 1.094-.45 1.14-1l.006-.11a2.536 2.536 0 01.766-1.823 2.65 2.65 0 011.877-.75c.35.009.695.086 1.048.241l.316.158c.496.213 1.084.058 1.382-.361l.073-.111.644-1.052a1.1 1.1 0 00-.303-1.455l-.273-.17a2.563 2.563 0 01-1.062-1.462 2.513 2.513 0 01.265-1.944c.19-.326.451-.606.792-.838l.161-.099c.512-.293.71-.921.473-1.417l-.07-.134-.013-.028-.585-.995a1.157 1.157 0 00-1.34-.513l-.111.044-.104.051a2.661 2.661 0 01-1.984.272 2.607 2.607 0 01-1.596-1.18 2.488 2.488 0 01-.342-1.021l-.014-.253a1.11 1.11 0 00-.323-.814 1.158 1.158 0 00-.823-.34zm-.613 5.284c1.842 0 3.336 1.463 3.336 3.268 0 1.805-1.494 3.268-3.336 3.268-1.842 0-3.336-1.463-3.336-3.268 0-1.805 1.494-3.268 3.336-3.268zm0 1.448c-1.026 0-1.858.815-1.858 1.82 0 1.005.832 1.82 1.858 1.82 1.026 0 1.858-.815 1.858-1.82 0-1.005-.832-1.82-1.858-1.82z"
                              />
                            </svg>
                            Settings
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a
                            href="#0"
                            className="_left_inner_area_explore_link"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 22 24"
                              fill="none"
                              stroke="#666"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              className="feather feather-save"
                            >
                              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                              <polyline points="17 21 17 13 7 13 7 21"></polyline>
                              <polyline points="7 3 7 8 15 8"></polyline>
                            </svg>
                            Save post
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_left_inner_area_suggest_content _mar_b24">
                        <h4 className="_left_inner_area_suggest_content_title _title5">
                          Suggested People
                        </h4>
                        <span className="_left_inner_area_suggest_content_txt">
                          <a
                            className="_left_inner_area_suggest_content_txt_link"
                            href="#0"
                          >
                            See All
                          </a>
                        </span>
                      </div>
                      {people.map((person) => (
                        <div
                          key={person.id}
                          className="_left_inner_area_suggest_info"
                        >
                          <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image">
                              <a href="#0">
                                <img
                                  src={person.image}
                                  alt={person.name}
                                  className="_info_img1"
                                />
                              </a>
                            </div>
                            <div className="_left_inner_area_suggest_info_txt">
                              <a href="#0">
                                <h4 className="_left_inner_area_suggest_info_title">
                                  {person.name}
                                </h4>
                              </a>
                              <p className="_left_inner_area_suggest_info_para">
                                {person.title}
                              </p>
                            </div>
                          </div>
                          <div className="_left_inner_area_suggest_info_link">
                            <a href="#0" className="_info_link">
                              Connect
                            </a>
                          </div>
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
                          <div
                            key={story.id}
                            className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col"
                          >
                            <div
                              className={`${story.isOwnStory ? "_feed_inner_profile_story" : "_feed_inner_public_story"} _b_radious6`}
                            >
                              <div
                                className={
                                  story.isOwnStory
                                    ? "_feed_inner_profile_story_image"
                                    : "_feed_inner_public_story_image"
                                }
                              >
                                <img
                                  src={story.image}
                                  alt={story.name}
                                  className={
                                    story.isOwnStory
                                      ? "_profile_story_img"
                                      : "_public_story_img"
                                  }
                                />
                                {!story.isOwnStory ? (
                                  <div className="_feed_inner_story_avatar">
                                    <img
                                      src={story.avatar}
                                      alt={`${story.name} avatar`}
                                      className="_feed_inner_story_avatar_img"
                                    />
                                  </div>
                                ) : null}
                                {story.isOwnStory ? (
                                  <div className="_feed_inner_story_btn">
                                    <button
                                      type="button"
                                      className="_feed_inner_story_btn_link"
                                      aria-label="Add story"
                                    >
                                      +
                                    </button>
                                  </div>
                                ) : null}
                                <div
                                  className={
                                    story.isOwnStory
                                      ? "_feed_inner_story_txt"
                                      : "_feed_inner_pulic_story_txt"
                                  }
                                >
                                  <p
                                    className={
                                      story.isOwnStory
                                        ? "_feed_inner_story_para"
                                        : "_feed_inner_pulic_story_para"
                                    }
                                  >
                                    {story.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {moreStories.length > 0 ? (
                        <div className="_feed_inner_story_arrow">
                          <button
                            type="button"
                            className="_feed_inner_story_arrow_btn"
                            aria-label="View more stories"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="16"
                              height="16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              aria-hidden="true"
                            >
                              <path
                                d="M9 6l6 6-6 6"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : null}
                    </div>

                    <form
                      className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16"
                      onSubmit={handleCreatePost}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoSelect}
                      />
                      <div className="_feed_inner_text_area_box">
                        <div className="_feed_inner_text_area_box_image">
                          <img
                            src="/images/txt_img.png"
                            alt="Profile"
                            className="_txt_img"
                          />
                        </div>
                        <div className="form-floating _feed_inner_text_area_box_form">
                          <textarea
                            className="form-control _textarea"
                            placeholder="Leave a comment here"
                            id="floatingTextarea"
                            value={composerText}
                            onChange={(event) =>
                              setComposerText(event.target.value)
                            }
                            disabled={isSubmittingPost}
                          />
                          <label
                            className="_feed_textarea_label"
                            htmlFor="floatingTextarea"
                          >
                            <span>Write something ...</span>
                            <PenComposerIcon />
                          </label>
                        </div>
                      </div>

                      {composerError ? (
                        <div className="alert alert-danger mt-3 mb-0" role="alert">
                          {composerError}
                        </div>
                      ) : null}

                      {composerSuccess ? (
                        <div className="alert alert-success mt-3 mb-0" role="alert">
                          {composerSuccess}
                        </div>
                      ) : null}

                      {selectedImagePreview ? (
                        <div className="mt-3 rounded overflow-hidden border">
                          <img
                            src={selectedImagePreview}
                            alt={selectedImage?.name || "Selected post image"}
                            className="_time_img"
                          />
                          <div className="d-flex align-items-center justify-content-between p-3">
                            <span className="small text-break">
                              {selectedImage?.name}
                            </span>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={clearSelectedImage}
                              disabled={isSubmittingPost}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : null}

                      <div className="_feed_inner_text_area_bottom">
                        <div className="_feed_inner_text_area_item">
                          <div className="_feed_inner_text_area_bottom_photo _feed_common">
                            <button
                              type="button"
                              className="_feed_inner_text_area_bottom_photo_link"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isSubmittingPost}
                            >
                              <PhotoComposerIcon />
                              {selectedImage ? "Change Photo" : "Photo"}
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_video _feed_common">
                            <button
                              type="button"
                              className="_feed_inner_text_area_bottom_photo_link"
                              disabled
                            >
                              <VideoComposerIcon />
                              Video
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_event _feed_common">
                            <button
                              type="button"
                              className="_feed_inner_text_area_bottom_photo_link"
                              disabled
                            >
                              <EventComposerIcon />
                              Event
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_article _feed_common">
                            <button
                              type="button"
                              className="_feed_inner_text_area_bottom_photo_link"
                              disabled
                            >
                              <ArticleComposerIcon />
                              Article
                            </button>
                          </div>
                        </div>
                        <div className="_feed_inner_text_area_btn">
                          <button
                            type="submit"
                            className="_feed_inner_text_area_btn_link"
                            disabled={isSubmittingPost}
                          >
                            <PostComposerIcon />
                            <span>
                              {isSubmittingPost ? "Posting..." : "Post"}
                            </span>
                          </button>
                        </div>
                      </div>
                    </form>

                    {feedError ? (
                      <div className="alert alert-danger" role="alert">
                        {feedError}
                      </div>
                    ) : null}

                    {isLoadingPosts ? (
                      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <p className="mb-0">Loading posts...</p>
                        </div>
                      </div>
                    ) : null}

                    {!isLoadingPosts && posts.length === 0 ? (
                      <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <p className="mb-0">
                            No posts yet. Write the first post from the composer
                            above.
                          </p>
                        </div>
                      </div>
                    ) : null}

                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16"
                      >
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <div className="_feed_inner_timeline_post_top">
                            <div className="_feed_inner_timeline_post_box">
                              <div className="_feed_inner_timeline_post_box_image">
                                <img
                                  src={post.author.avatar}
                                  alt={post.author.name}
                                  className="_post_img"
                                />
                              </div>
                              <div className="_feed_inner_timeline_post_box_txt">
                                <h4 className="_feed_inner_timeline_post_box_title">
                                  {post.author.name}
                                </h4>
                                <p className="_feed_inner_timeline_post_box_para">
                                  {formatRelativeTime(post.createdAt)} .{" "}
                                  <a href="#0">{post.visibility}</a>
                                </p>
                              </div>
                            </div>
                            <div className="_feed_inner_timeline_post_box_dropdown">
                              <div className="_feed_timeline_post_dropdown">
                                <button
                                  type="button"
                                  className="_feed_timeline_post_dropdown_link"
                                  onClick={() =>
                                    setOpenPostMenuId((value) =>
                                      value === post.id ? null : post.id,
                                    )
                                  }
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
																<circle cx="2" cy="2" r="2" fill="#C4C4C4" />
																<circle cx="2" cy="8" r="2" fill="#C4C4C4" />
																<circle cx="2" cy="15" r="2" fill="#C4C4C4" />
															</svg>
                                </button>
                              </div>
                              <div
                                className={`_feed_timeline_dropdown _timeline_dropdown${openPostMenuId === post.id ? " show" : ""}`}
                              >
                                <ul className="_feed_timeline_dropdown_list">
                                  <li className="_feed_timeline_dropdown_item">
                                    <a
                                      href="#0"
                                      className="_feed_timeline_dropdown_link"
                                    >
                                      Save Post
                                    </a>
                                  </li>
                                  <li className="_feed_timeline_dropdown_item">
                                    <a
                                      href="#0"
                                      className="_feed_timeline_dropdown_link"
                                    >
                                      Turn On Notification
                                    </a>
                                  </li>
                                  <li className="_feed_timeline_dropdown_item">
                                    <a
                                      href="#0"
                                      className="_feed_timeline_dropdown_link"
                                    >
                                      Hide
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <h4 className="_feed_inner_timeline_post_title">
                            {post.title}
                          </h4>
                          {post.image ? (
                            <div className="_feed_inner_timeline_image">
                              <img
                                src={post.image}
                                alt={post.title}
                                className="_time_img"
                              />
                            </div>
                          ) : null}
                        </div>
                        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                          <div className="_feed_inner_timeline_total_reacts_image">
                            <img
                              src="/images/react_img1.png"
                              alt="react"
                              className="_react_img1"
                            />
                            <img
                              src="/images/react_img2.png"
                              alt="react"
                              className="_react_img"
                            />
                            <p className="_feed_inner_timeline_total_reacts_para">
                              9+
                            </p>
                          </div>
                          <div className="_feed_inner_timeline_total_reacts_txt">
                            <p className="_feed_inner_timeline_total_reacts_para1">
                              <a href="#0">
                                <span>{post.commentCount}</span> Comment
                              </a>
                            </p>
                            <p className="_feed_inner_timeline_total_reacts_para2">
                              <span>{post.shareCount}</span> Share
                            </p>
                          </div>
                        </div>
                        <div className="_feed_inner_timeline_reaction">
                          <button className="_feed_inner_timeline_reaction_emoji _feed_reaction _feed_reaction_active">
                            <span className="_feed_inner_timeline_reaction_link">
                              {" "}
                              <span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="19"
                                  height="19"
                                  fill="none"
                                  viewBox="0 0 19 19"
                                >
                                  <path
                                    fill="#FFCC4D"
                                    d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z"
                                  />
                                  <path
                                    fill="#664500"
                                    d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z"
                                  />
                                  <path
                                    fill="#fff"
                                    d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z"
                                  />
                                  <path
                                    fill="#664500"
                                    d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z"
                                  />
                                </svg>
                                Haha
                              </span>
                            </span>
                          </button>
                          <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                            <span className="_feed_inner_timeline_reaction_link">
                              {" "}
                              <span>
                                <svg
                                  className="_reaction_svg"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="21"
                                  height="21"
                                  fill="none"
                                  viewBox="0 0 21 21"
                                >
                                  <path
                                    stroke="#000"
                                    d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z"
                                  />
                                  <path
                                    stroke="#000"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6.938 9.313h7.125M10.5 14.063h3.563"
                                  />
                                </svg>
                                Comment
                              </span>
                            </span>
                          </button>
                          <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                            <span className="_feed_inner_timeline_reaction_link">
                              {" "}
                              <span>
                                <svg
                                  className="_reaction_svg"
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="21"
                                  fill="none"
                                  viewBox="0 0 24 21"
                                >
                                  <path
                                    stroke="#000"
                                    stroke-linejoin="round"
                                    d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z"
                                  />
                                </svg>
                                Share
                              </span>
                            </span>
                          </button>
                        </div>
                        <div className="_feed_inner_timeline_cooment_area">
                          <div className="_feed_inner_comment_box">
                            <form
                              className="_feed_inner_comment_box_form"
                              onSubmit={preventDefault}
                            >
                              <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image">
                                  <img
                                    src="/images/comment_img.png"
                                    alt="Comment"
                                    className="_comment_img"
                                  />
                                </div>
                                <div className="_feed_inner_comment_box_content_txt">
                                  <textarea
                                    className="form-control _comment_textarea"
                                    placeholder="Write a comment"
                                  />
                                </div>
                              </div>
                              <div className="_feed_inner_comment_box_icon">
														<button className="_feed_inner_comment_box_icon_btn">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
																<path fill="#000" fill-opacity=".46" fill-rule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clip-rule="evenodd" />
															</svg>
														</button>
														<button className="_feed_inner_comment_box_icon_btn">
															<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16">
																<path fill="#000" fill-opacity=".46" fill-rule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933zm.426 5.733l.017.015.013.013.009.008.037.037c.12.12.453.46 1.443 1.477a.5.5 0 11-.716.697S10.73 8.91 10.633 8.816a.614.614 0 00-.433-.118.622.622 0 00-.421.225c-1.55 1.88-1.568 1.897-1.594 1.922a1.456 1.456 0 01-2.057-.021s-.62-.63-.63-.642c-.155-.143-.43-.134-.594.04l-1.02 1.076a.498.498 0 01-.707.018.499.499 0 01-.018-.706l1.018-1.075c.54-.573 1.45-.6 2.025-.06l.639.647c.178.18.467.184.646.008l1.519-1.843a1.618 1.618 0 011.098-.584c.433-.038.854.088 1.19.363zM5.706 4.42c.921 0 1.67.75 1.67 1.67 0 .92-.75 1.67-1.67 1.67-.92 0-1.67-.75-1.67-1.67 0-.921.75-1.67 1.67-1.67zm0 1a.67.67 0 10.001 1.34.67.67 0 00-.002-1.34z" clip-rule="evenodd" />
															</svg>
														</button>
													</div>
                            </form>
                          </div>
                        </div>
                        <div className="_timline_comment_main">
                          <div className="_previous_comment">
                            <button
                              type="button"
                              className="_previous_comment_txt"
                            >
                              View 4 previous comments
                            </button>
                          </div>
                          <div className="_comment_main">
                            <div className="_comment_image">
                              <a href="#0" className="_comment_image_link">
                                <img
                                  src="/images/txt_img.png"
                                  alt="Comment avatar"
                                  className="_comment_img1"
                                />
                              </a>
                            </div>
                            <div className="_comment_area">
                              <div className="_comment_details">
                                <div className="_comment_details_top">
                                  <div className="_comment_name">
                                    <a href="#0">
                                      <h4 className="_comment_name_title">
                                        Radovan SkillArena
                                      </h4>
                                    </a>
                                  </div>
                                </div>
                                <div className="_comment_status">
                                  <p className="_comment_status_text">
                                    <span>
                                      {post.commentPreview ||
                                        "No comments yet on this post."}
                                    </span>
                                  </p>
                                </div>
                              </div>
                            </div>
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
                      <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">
                          You Might Like
                        </h4>
                      </div>
                      <hr className="_underline" />
                      <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box">
                          <div className="_right_inner_area_info_box_image">
                            <a href="#0">
                              <img
                                src="/images/Avatar.png"
                                alt="Radovan SkillArena"
                                className="_ppl_img"
                              />
                            </a>
                          </div>
                          <div className="_right_inner_area_info_box_txt">
                            <a href="#0">
                              <h4 className="_right_inner_area_info_box_title">
                                Radovan SkillArena
                              </h4>
                            </a>
                            <p className="_right_inner_area_info_box_para">
                              Founder &amp; CEO at Trophy
                            </p>
                          </div>
                        </div>
                        <div className="_right_info_btn_grp">
                          <button
                            type="button"
                            className="_right_info_btn_link"
                          >
                            Ignore
                          </button>
                          <button
                            type="button"
                            className="_right_info_btn_link _right_info_btn_link_active"
                          >
                            Follow
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="_layout_right_sidebar_inner">
                    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                          <h4 className="_feed_right_inner_area_card_content_title _title5">
                            Your Friends
                          </h4>
                        </div>
                      </div>
                      <div className="_feed_bottom_fixed">
                        {friends.map((friend) => (
                          <div
                            key={friend.id}
                            className={`_feed_right_inner_area_card_ppl${friend.status === "away" ? " _feed_right_inner_area_card_ppl_inactive" : ""}`}
                          >
                            <div className="_feed_right_inner_area_card_ppl_box">
                              <div className="_feed_right_inner_area_card_ppl_image">
                                <a href="#0">
                                  <img
                                    src={friend.image}
                                    alt={friend.name}
                                    className="_box_ppl_img"
                                  />
                                </a>
                              </div>
                              <div className="_feed_right_inner_area_card_ppl_txt">
                                <a href="#0">
                                  <h4 className="_feed_right_inner_area_card_ppl_title">
                                    {friend.name}
                                  </h4>
                                </a>
                                <p className="_feed_right_inner_area_card_ppl_para">
                                  {friend.title}
                                </p>
                              </div>
                            </div>
                            <div className="_feed_right_inner_area_card_ppl_side">
                              {friend.status === "online" ? (
                                <div className="_feed_right_inner_area_card_ppl_side">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                  >
                                    <rect
                                      width="12"
                                      height="12"
                                      x="1"
                                      y="1"
                                      fill="#0ACF83"
                                      stroke="#fff"
                                      stroke-width="2"
                                      rx="6"
                                    />
                                  </svg>
                                </div>
                              ) : (
                                <div className="_feed_right_inner_area_card_ppl_side">
                                  {" "}
                                  <span>5 minute ago</span>
                                </div>
                              )}
                            </div>
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
