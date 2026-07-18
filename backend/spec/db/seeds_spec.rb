require 'rails_helper'

RSpec.describe 'db/seeds' do
  it 'inserts generated expenses in batches' do
    insert_count = 0
    subscriber = ActiveSupport::Notifications.subscribe('sql.active_record') do |_name, _started, _finished, _id, payload|
      insert_count += 1 if payload[:sql].include?('INSERT') && payload[:sql].include?('expenses')
    end

    begin
      load Rails.root.join('db/seeds.rb')
    ensure
      ActiveSupport::Notifications.unsubscribe(subscriber)
    end

    expect(insert_count).to be > 1
  end

  it 'does not reseed when data already exists' do
    category = Category.create!(name: 'Existing')
    expense = Expense.create!(
      description: 'Existing expense',
      amount: 12.34,
      category: category,
      date: Date.current
    )

    load Rails.root.join('db/seeds.rb')

    expect(Category.pluck(:name)).to contain_exactly('Existing')
    expect(Expense.pluck(:id)).to contain_exactly(expense.id)
  end
end
