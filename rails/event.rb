class Event < ActiveRecord::Base
  include ParsedParams
  STATUSES = ["active", "inactive"]

  has_many :invites, :dependent => :destroy
  belongs_to :creator, :class_name => "Admin", :foreign_key => :employee_id
  validates :name, :presence => true  #, :length => {:minimum => 1, :maximum => 50}

  before_save :set_default_status

  def self.advance_search(params)
    if params[:term].present?
      v = "%#{params[:term]}%"
      self.where("name ILIKE ? OR description ILIKE ?", "#{v}", "#{v}")
    else
      self.search(params)
    end
  end

  def invites_count
    self.invites.count
  end

  def invites_total
    query = self.invites.reorder("").select("SUM(CASE WHEN limit_count IS NULL THEN 1  WHEN limit_count = 0 THEN 99999999 ELSE limit_count END) AS count")
    query.first.count
  end

  def used_invites_total
    query = Invite.where(:event_id => self.id).joins("INNER JOIN customers ON customers.invite_id = invites.id").reorder("").select("COUNT(customers.id) AS count")
    query.first.count
  end

  def save_codes(codes, options = {})
    options ||= {}
    keys = (["event_id", "code", "batch_number"] + options.keys + ["created_at", "updated_at"]).join(", ")
    values = []

    next_val = self.class.connection.execute("SELECT nextval('events_batch_number_seq') AS nextval")[0]['nextval']    
    codes.each do |code|
      values << "('#{self.id}', '#{code}', #{next_val}, #{options.values.join(", ")}, now(), now())"
    end

    sql = "INSERT INTO invites(#{keys}) VALUES #{values.join(", ")}"
    results = ActiveRecord::Base.connection.execute(sql)
    self.create_activity key: "#{self.class.name.downcase}.generate_code", :params => {:count => codes.length, :is_custom_action => true}

    results
  end

  def self.generate_code(format)
    alphas = ("A".."Z").to_a
    numbers = ("1".."9").to_a
    is_constant = false

    begin
      result = ""
      0.upto(format.length - 1) do |i|
        if format[i].upcase == "A" && !is_constant
          result += alphas[rand(alphas.length)]
        elsif format[i] == "1" && !is_constant
          result += numbers[rand(numbers.length)]
        else
          if ["'", '"'].include?(format[i])
            is_constant = !is_constant
          else
            result += format[i]
          end
        end
      end
    end while Invite.where(:code => result).count > 0;

    result
  end

  def self.generate_codes(format, number)
    results = []
    1.upto(number) do |i|
      results << self.generate_code(format)
    end

    results
  end

  private

  def set_default_status
    self.status ||= STATUSES[0]
  end
end