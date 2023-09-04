import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    // transactionsByEmployeeUtils.invalidateData()
    await employeeUtils.fetchAll()
    // change the loading state
    setIsLoading(false)

    await paginatedTransactionsUtils.fetchAll()
  }, [employeeUtils, paginatedTransactionsUtils])


  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData();
      await transactionsByEmployeeUtils.fetchById(employeeId);
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  );
  

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions();
    }
  }, [employeeUtils.loading, employees, loadAllTransactions]);

  
  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />
        <hr className="RampBreak--l" />
        <InputSelect<Employee>
          // Use isLoadingEmployees to control the loading state of InputSelect
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return;
            }
            const hasValidId = newValue.id !== "";
            const loadTransactions = hasValidId ? loadTransactionsByEmployee : loadAllTransactions;
            // Load transactions based on the presence of a valid ID
            await loadTransactions(newValue.id);
          }}
          
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />
          {transactions !== null && paginatedTransactions?.nextPage !== null &&(
            <button
              className="RampButton"
              disabled={
                paginatedTransactionsUtils.loading || paginatedTransactions?.nextPage == null
                  ? true
                  : false
              }
              onClick={async () => {
                await loadAllTransactions()
              }}
            >
              {/*control the loading state of the button */}
              {paginatedTransactionsUtils.loading? "Loading..." : "View More"}
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
