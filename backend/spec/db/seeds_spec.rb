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
end
