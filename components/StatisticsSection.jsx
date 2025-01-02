export default function StatisticsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-4">95%</div>
            <h3 className="text-xl font-semibold mb-2">User Satisfaction</h3>
            <p className="text-gray-600">
              Our users consistently rate us highly for ease of use and
              reliability
            </p>
          </div>
          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-4">10x</div>
            <h3 className="text-xl font-semibold mb-2">Faster Analysis</h3>
            <p className="text-gray-600">
              Automated tools help you make decisions faster than traditional
              methods
            </p>
          </div>
          <div className="text-center p-8 rounded-lg bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
            <div className="text-5xl font-bold text-blue-600 mb-4">24/7</div>
            <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
            <p className="text-gray-600">
              Stay informed with continuous market data and portfolio tracking
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
