import { Button } from "../../Components/ui/button";
import { Progress } from "../../Components/ui/progress";
import { Card } from "../../Components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../Components/ui/avatar";

export default function ProfileScreen() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="mx-auto max-w-3xl p-6">
        <div className="mb-8 flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src="/avatar-placeholder.png" />
            <AvatarFallback>HB</AvatarFallback>
          </Avatar>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-800">User Name</h1>
            <div className="mt-2 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex text-sm justify-start">
                  <span>Progress: 5</span>
                  <span>/</span>
                  <span>10</span>
                </div>
                <Progress value={(31292 / 32541) * 100} className="mt-1 h-2" />
              </div>
            </div>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Interest</h2>
          <p className="text-gray-600">
            Hello, I&apos;m Heinz; I&apos;m a Computer Science student at the Federal University of Pernambuco (UFPE) 
            and I have a great desire to learn new technologies.
          </p>
        </section>

        <section className="mb-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-gray-200" />
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">heitorfelipes27@gmail.com</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Gerar Roadmap →
          </Button>
        </div>
      </Card>
    </div>
  );
}