class Api::V1::Admin::EventsController < Api::V1::Admin::BaseController
  before_action :set_event, except: [:index, :create, :summary]

  def index
    per_page = parsed_params[:per_page]
    page = parsed_params[:page]
    order = parsed_params[:order] || "events.created_at DESC"

    events = Event.advance_search(params).order(order)
    events = events.select(parsed_params[:select]) if parsed_params[:select].present?
    events = events.paginate(:page => page, :per_page => per_page)

    respond_json_results(events)
  end

  def create
    event = Event.create(event_params.merge(:employee_id => current_admin.id))
    if event.persisted?
      respond_json_results(event)
    else
      respond_json_error({:errors => event.errors})
    end
  end

  def update
    if @event.update_attributes(event_params)
      respond_json_results(@event)
    else
      respond_json_error(:errors => @event.errors)
    end
  end

  def show
    respond_json_results(@event)
  end

  def destroy
    if @event.destroy
      respond_json_results(@event)
    else
      respond_json_error()
    end
  end

  def summary
    from = Time.at(params[:from].to_f) if params[:from].present?

    if params[:to].present?
      to = Time.at(params[:to].to_f)
    else
      to = Time.now
    end

    if params[:object] == "event"
      if from.present?
        scope = Event.where("events.created_at BETWEEN ? AND ? ", from, to)
      else
        scope = Event.where("events.created_at < ? ", to)
      end

      if ["active", "inactive"].include?(params[:status])
        scope = scope.where(:status => params[:status])
      end

      if params[:count_by] == "total_customer"
        results = scope.joins("LEFT JOIN invites ON invites.event_id = events.id")
                       .joins("LEFT JOIN customers ON customers.invite_id = invites.id")
                       .group("events.id")
                       .where("customers.customer_type != ?", Customer::TYPES[:spam])
                       .select("events.id AS id, events.name AS name, COUNT(DISTINCT(customers.id)) AS count")
        respond_json_results results.as_json(:only => [:id, :name, :count])
      else
        results = scope.count
        respond_json_results results
      end
    else
      respond_json_error
    end
  end

  def update_batch
    invites = @event.invites.where(:batch_number => params[:batch_number])

    status = params[:status].try(:downcase)
    if ["inactive", "active"].include?(status)
      count = invites.update_all(:status => status)
      respond_json_results({:count => count})
    else
      respond_json_error(:code => :invalid_parameters)
    end
  end

  def delete_batch
    invites = @event.invites.where(:batch_number => params[:batch_number])
    results = invites.delete_all
    
    respond_json_results(results)
  end

  def export_batch
    invites = @event.invites.where(:batch_number => params[:batch_number])
    if params[:has_used] == "false"
      invites = invites.joins("LEFT JOIN customers on customers.invite_id = invites.id").where("customers.invite_id IS NULL")
    end
    invites = invites.select("code")

    codes = invites.map(&:code)
    if params[:export_format] == "csv"
      csv = CSV.generate do |c|
        c << ["Code"]
        codes.each do |code|
          c << [code]
        end
      end

      send_data csv, {:filename => "#{@event.name}_#{params[:batch_number]}.csv"}
    else
      send_data codes.join("\r\n"), {:filename => "#{@event.name}_#{params[:batch_number]}.txt"}
    end
  end

  private
    def set_event
      @event = Event.find(params[:id])
    end

    def event_params
      params.require(:event).permit(:name, :description, :status)
    end
end
