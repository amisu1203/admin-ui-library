import { Button } from '@daggle-dev/admin-ui';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-30 p-12">
      <h1 className="text-display-sm text-gray-90 mb-8">
        Button Large 사이즈 테스트
      </h1>
      <div className="flex flex-wrap items-center gap-4">
        <Button size="large" variant="default">
          Large (default)
        </Button>
        <Button size="large" variant="fill">
          Large (fill)
        </Button>
        <Button size="large" variant="outline">
          Large (outline)
        </Button>
        <Button size="large" variant="outline-primary">
          Large (outline-primary)
        </Button>
        <Button size="large" variant="destructive">
          Large (destructive)
        </Button>
      </div>
    </div>
  );
}
