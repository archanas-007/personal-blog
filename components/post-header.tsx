import DateFormatter from "./date-formatter";
import CoverImage from "./cover-image";
import PostTitle from "./post-title";

type Props = {
  title: string;
  coverImage: string;
  date: string;
};

const PostHeader = ({ title, coverImage, date }: Props) => {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      <span className="hidden md:block md:mb-12">
        <DateFormatter dateString={date} />
      </span>
      <div className="mb-8 md:mb-16 sm:mx-0">
        <CoverImage title={title} src={coverImage} />
      </div>
    </>
  );
};

export default PostHeader;
