import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loading = () => {
  return (
    <div className="Loading z-30 bg-gray-50 w-full h-full flex items-center justify-center image.pngimage.pngimage.pngimage.png absolute z-10 bg-opacity-60 overflow-hidden">
      <FontAwesomeIcon
        icon={faSpinner}
        className="animate-spin text-2xl font-sm"
      />
    </div>
  );
};

export default Loading;
