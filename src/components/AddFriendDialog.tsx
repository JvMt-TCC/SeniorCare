import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User } from "lucide-react";

interface AddFriendDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddFriend: (friend: { name: string; avatar: string }) => void;
}

const AddFriendDialog = ({ isOpen, onOpenChange, onAddFriend }: AddFriendDialogProps) => {
  const [friendName, setFriendName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (friendName.trim()) {
      onAddFriend({
        name: friendName.trim(),
        avatar: "" // Avatar padrão será usado
      });
      setFriendName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center pb-4">
          <DialogTitle className="text-2xl text-primary mb-2">
            Adicionar Amigo
          </DialogTitle>
          <p className="text-muted-foreground">
            Conecte-se com mais pessoas da sua comunidade
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-primary-soft rounded-full flex items-center justify-center">
              <User size={40} className="text-primary" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="friendName" className="text-base font-medium">
              Nome do Amigo
            </Label>
            <Input
              id="friendName"
              type="text"
              placeholder="Digite o nome completo"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              className="h-12 text-base rounded-xl border-2 focus:border-primary"
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-2"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;