import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

const CustomDialog = ({
  openButton,
  title,
  description,
  content,
  shouldShowHeader = false,
  onContinue,
}: {
  openButton: React.ReactNode;
  title: string;
  description: string;
  content: React.ReactNode;
  shouldShowHeader?: boolean;
  onContinue: () => void;
}) => {
  const Header = () => {
    if (shouldShowHeader) {
      return (
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
      );
    } else {
      return (
        <AlertDialogHeader>
          <VisuallyHidden.Root asChild>
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root asChild>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </VisuallyHidden.Root>
        </AlertDialogHeader>
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{openButton}</AlertDialogTrigger>
      <AlertDialogContent>
        {Header()}
        {content}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomDialog;
