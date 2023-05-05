import { createContext, useContext, useEffect, useState } from "react";
import { AccountExtended, useAccount } from "../utils/account";

type Setup = {
  isSetupDone?: boolean;
  account: AccountExtended;
};

export const SetupContext = createContext<Setup>({} as Setup);

export function useSetup() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error("Setup Context used outside of provider");
  }
  return context;
}

export function SetupContextProvider(props: {
  children: JSX.Element[] | JSX.Element;
}) {
  const [isSetupDone, setIsSetupDone] = useState<boolean>();
  const account = useAccount();

  const setup: Setup = {
    isSetupDone,
    account,
  };

  useEffect(() => {
    setIsSetupDone(account.isAccountCreated);
  }, []);

  useEffect(() => {
    setIsSetupDone(account.isAccountCreated);
  }, [account]);

  return (
    <SetupContext.Provider value={setup}>
      {props.children}
    </SetupContext.Provider>
  );
}
