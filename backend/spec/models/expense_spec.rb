require 'rails_helper'

RSpec.describe Expense, type: :model do
  let(:category) { Category.create!(name: "Food") }
  let(:expense) do
    described_class.new(
      description: "Lunch",
      amount: 12.50,
      category: category,
      date: Date.current
    )
  end

  it "requires a description" do
    expense.description = ""

    expect(expense).not_to be_valid
    expect(expense.errors[:description]).to include("can't be blank")
  end

  it "requires an amount" do
    expense.amount = nil

    expect(expense).not_to be_valid
    expect(expense.errors[:amount]).to include("can't be blank")
  end

  it "requires amount to be greater than zero" do
    expense.amount = 0

    expect(expense).not_to be_valid
    expect(expense.errors[:amount]).to include("must be greater than 0")
  end
end
