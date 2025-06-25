import { User } from "lucide-react";

const SlideBarSkeleton = () => {
  const skeletonContact = Array(8).fill(null);
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-300">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <User className="w-6 h-6" />
          <span className="font-medium hidden lg:block">
            Những liên hệ khác
          </span>
        </div>
      </div>
      <div className="overflow-y-auto w-full py-3">
        {skeletonContact.map((_, index) => (
          <div key={index} className="w-full p-3 flex items-center gap-3">
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton size-12 rounded-full" />
            </div>
            <div className="hidden lg:block text-left min-w-1 flex-1">
                <div className="skeleton h-4 w-32 mb-4" />
                <div  className="skeleton h-3 w-16"/>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SlideBarSkeleton