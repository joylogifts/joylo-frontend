import { Skeleton } from 'primereact/skeleton';

export default function CustomLanguageSkeleton() {
  return (
    <div className="flex items-center p-2 px-3">
      <Skeleton shape="circle" size="40px" className="mr-3" />
      <Skeleton width="20px" height="20px" />
    </div>
  );
}
