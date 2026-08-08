import React, { createContext, useContext, useMemo } from 'react';
import { MongoAbility, createMongoAbility, AbilityBuilder } from '@casl/ability';
import { Can as CaslCan } from '@casl/react';

export type AppAbility = MongoAbility;

export const AbilityContext = createContext<AppAbility>(createMongoAbility());
export const Can = CaslCan;

export const AbilityProvider: React.FC<{ user: any; children: React.ReactNode }> = ({ user, children }) => {
  const ability = useMemo(() => buildAbility(user), [user]);

  return (
    <AbilityContext.Provider value={ability}>
      {children}
    </AbilityContext.Provider>
  );
};

export const useAbility = () => useContext(AbilityContext);

function buildAbility(user: any): AppAbility {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  if (user) {
    if (user.isSystemAdmin || user.role === 'Admin System') {
      can('manage', 'all');
    } else if (Array.isArray(user.permissions) && user.permissions.length > 0) {
      for (const p of user.permissions) {
        const subject = p.subject;
        const actions = Array.isArray(p.actions) ? p.actions : [];
        for (const act of actions) {
          can(act, subject);
        }
      }
    } else {
      can('read', 'auth');
      can('read', 'profile');
      can('edit', 'profile');
      can('read', 'projects');
      can('create', 'projects');
      can('edit', 'projects');
      can('delete', 'projects');
      can('read', 'ai');
      can('create', 'ai');
    }
  }

  return build();
}
