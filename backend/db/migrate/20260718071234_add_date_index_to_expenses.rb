class AddDateIndexToExpenses < ActiveRecord::Migration[7.2]
  def change
    add_index :expenses, [ :date, :id ], order:  { date: :desc, id: :desc }
  end
end
