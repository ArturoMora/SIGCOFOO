
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace INEEL.DataAccess.GEN.Util
{
    public class CountModel
    {

        public String Name { get; set; }
        public long Count { get; set; }
        public String Id { get; set; }
        public override string ToString()
        {
            return this.Id;
        }
    }


    public class ComparerCountModel : IEqualityComparer<CountModel>
    {
        #region IEqualityComparer
        public bool Equals(CountModel x, CountModel y)
        {
            return x.Id.Equals(y.Id);

        }

        public int GetHashCode(CountModel obj)
        {
            return obj.Id.GetHashCode();
        }
        #endregion
    }
}