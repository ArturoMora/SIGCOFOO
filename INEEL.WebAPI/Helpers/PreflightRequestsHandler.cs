using log4net;
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;


namespace INEEL.WebAPI.Helpers
{
    public class PreflightRequestsHandler : DelegatingHandler
    {
        //private static readonly ILog log = LogManager.GetLogger(typeof(PreflightRequestsHandler));
        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            
            if (request.Headers.Contains("Origin") && request.Method.Method.Equals("OPTIONS"))
            {
                var response = new HttpResponseMessage { StatusCode = HttpStatusCode.OK };

                // Define and add values to variables: origins, headers, methods (can be global)               
                response.Headers.Add("Access-Control-Allow-Origin", "*");
                response.Headers.Add("Access-Control-Allow-Headers", "*");
                response.Headers.Add("Access-Control-Allow-Methods", "*");

                var tsc = new TaskCompletionSource<HttpResponseMessage>();

                tsc.SetResult(response);

                return tsc.Task;
            }
            return base.SendAsync(request, cancellationToken);
        }

    }
}
