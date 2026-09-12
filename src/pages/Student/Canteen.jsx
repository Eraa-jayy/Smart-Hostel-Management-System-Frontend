import { useEffect, useState } from "react";
import { CalendarDays, ChefHat, Leaf, Moon, Sun, Sunset, Building2 } from "lucide-react";
import { getMyHostelCanteenMeals } from "../../service/canteenService";

const details = { BREAKFAST: { label: "Breakfast", Icon: Sun, color: "from-amber-400 to-orange-500" }, LUNCH: { label: "Lunch", Icon: Sunset, color: "from-emerald-400 to-teal-500" }, DINNER: { label: "Dinner", Icon: Moon, color: "from-violet-400 to-purple-500" } };
const items = (value = "") => value.split(/,|\n/).map((item) => item.trim()).filter(Boolean);

export default function Canteen() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hostelName, setHostelName] = useState("");

  useEffect(() => {
    getMyHostelCanteenMeals()
      .then((res) => {
        const data = res.data || [];
        setMeals(data);
        if (data.length > 0 && data[0].hostelName) {
          setHostelName(data[0].hostelName);
        }
      })
      .catch(() => setError("Today's menus are unavailable right now."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Canteen</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Today's published meal menus {hostelName ? `for ${hostelName}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hostelName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xs font-semibold">
              <Building2 size={14} />
              <span>{hostelName}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <CalendarDays size={14} />
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {Object.entries(details).map(([type, { label, Icon, color }]) => {
          const meal = meals.find((m) => m.mealType === type);
          const categories = meal
            ? [
                ["Main Dishes", meal.mainDishes || meal.menuItems],
                ["Curries", meal.curries],
                ["Short Eats", meal.shortEats],
              ].filter(([, value]) => value)
            : [];
          const count = categories.reduce((total, [, value]) => total + items(value).length, 0);

          return (
            <section key={type} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className={`p-5 bg-gradient-to-r ${color} flex items-center gap-3`}>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{label}</h2>
                  <p className="text-xs text-white/75">{meal ? `${count} items published` : "Not yet published"}</p>
                </div>
              </div>
              <div className="p-5 min-h-48">
                {loading ? (
                  <p className="text-sm text-gray-400">Loading menu...</p>
                ) : categories.length ? (
                  <div className="space-y-4">
                    {categories.map(([category, value]) => (
                      <div key={category}>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">{category}</h3>
                        <div className="space-y-2">
                          {items(value).map((item, index) => (
                            <div key={`${item}-${index}`} className="flex gap-2.5 p-2.5 rounded-xl bg-gray-50">
                              <Leaf size={14} className="text-emerald-500 mt-0.5" />
                              <span className="text-sm font-medium text-gray-700">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full py-8 text-center">
                    <ChefHat size={28} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-sm text-gray-400">Menu will be published soon</p>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
