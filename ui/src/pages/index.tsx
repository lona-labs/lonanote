import { path } from '@/bindings';

export default function Index() {
  return (
    <div>
      <div
        onClick={async () => {
          console.log(await path.getAllPath());
        }}
      >
        Index
      </div>
    </div>
  );
}
