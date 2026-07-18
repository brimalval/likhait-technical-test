require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: 'Food') }

  def build_expense(date:)
    described_class.new(
      description: 'Lunch',
      amount: 100.00,
      category: category,
      date: date
    )
  end

  it 'is valid with today as the expense date' do
    expense = build_expense(date: Date.current)

    expect(expense).to be_valid
  end

  it 'is valid with a past expense date' do
    expense = build_expense(date: Date.current - 1.day)

    expect(expense).to be_valid
  end

  it 'is invalid without an expense date' do
    expense = build_expense(date: nil)

    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include("can't be blank")
  end

  it 'is invalid with a future expense date' do
    expense = build_expense(date: Date.current + 1.day)

    expect(expense).not_to be_valid
    expect(expense.errors[:date]).to include('cannot be in the future')
  end
end
