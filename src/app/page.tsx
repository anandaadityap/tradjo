import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Button
        className="hover:cursor-pointer"
        variant={"outline"}
      >
        Click Me!
      </Button>
    </div>
  );
}
