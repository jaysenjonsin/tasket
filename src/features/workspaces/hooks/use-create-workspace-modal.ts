import { useQueryState, parseAsBoolean } from 'nuqs';
//this hook is used to open and close the create workspace modal
export const useCreateWorkSpaceModal = () => {
  const [isOpen, setIsOpen] = useQueryState(
    'create-workspace',
    parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true })
  );

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
//clearOnDefault changes the url from localhost?create-workspace=true to just localhost
