import { createContext, useContext, useState } from 'react';
import { Group, Expense, Balance } from '../types';

type GroupContextType = {
  groups: Group[];
  addGroup: (group: Group) => void;
  deleteGroup: (id: string) => void;
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  settleExpense: (id: string) => void;
  getExpensesByGroup: (groupId: string) => Expense[];
  calculateBalances: (groupId: string) => Balance[];
};

// 1. Crear el contexto
const GroupContext = createContext<GroupContextType | null>(null);

// 2. Hook personalizado
export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroups debe usarse dentro de GroupProvider');
  return context;
};

// 3. Proveedor
export const GroupProvider = ({ children }: { children: React.ReactNode }) => {

  const [groups, setGroups] = useState<Group[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // --- Grupos ---
  const addGroup = (group: Group) => {
    setGroups((prev) => [group, ...prev]);
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setExpenses((prev) => prev.filter((e) => e.groupId !== id));
  };

  // --- Gastos ---
  const addExpense = (expense: Expense) => {
    setExpenses((prev) => [expense, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const settleExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, settled: true } : e))
    );
  };

  const getExpensesByGroup = (groupId: string) =>
    expenses.filter((e) => e.groupId === groupId);

  // --- Cálculo de balances ---
  const calculateBalances = (groupId: string): Balance[] => {
    const groupExpenses = getExpensesByGroup(groupId).filter((e) => !e.settled);
    const group = groups.find((g) => g.id === groupId);
    if (!group || groupExpenses.length === 0) return [];

    const totalAmount = groupExpenses.reduce((sum, e) => sum + e.amount, 0);
    const share = totalAmount / group.participants.length;

    return group.participants.map((p) => {
      const paid = groupExpenses
        .filter((e) => e.paidBy === p.name)
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        participantName: p.name,
        owes: share - paid,
      };
    });
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        addGroup,
        deleteGroup,
        expenses,
        addExpense,
        deleteExpense,
        settleExpense,
        getExpensesByGroup,
        calculateBalances,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};
