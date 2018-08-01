using System;
using iTextSharp.text.pdf;
using iTextSharp.text.pdf.parser;
using System.Text;
using Excel = NetOffice.ExcelApi;
using Word = NetOffice.WordApi;
using System.Text.RegularExpressions;
//using Microsoft.Office.Interop.PowerPoint;
using INEEL.DataAccess.GEN.Util;

namespace INEEL.WebAPI.Utilidades
{
    public class ToPlainText
    {
        public StringBuilder GetText(string fullpath, string q)
        //public StringBuilder GetText(string q)
        {

            StringBuilder result = new StringBuilder("Error: Documento no soportado");
            if (!String.IsNullOrEmpty(q))
            {
                //string fullpathOk = System.IO.Path.GetFullPath(fullpath);
                Console.Write("file =" + fullpath);
                switch (q)
                {
                    case ".pdf":
                        result = GetTextFromPDF(fullpath);
                        break;
                    case ".docx":
                    case ".doc":
                    case ".rtf": result = GetTextFromWord(fullpath); break;
                    //case ".pptx":
                    //case ".ppt":
                    //case ".ppsx":
                    //case ".pps": result = GetTextFromPowerPoint(fullpath); break;
                    case ".xlsx":
                    case ".xls": result = GetTextFromExcel(fullpath); break;
                    //case ".pub": result = GetTextFromPublisher(fullpath); break;
                    case ".html": result = GetTextFromHtml(fullpath); break;
                    case ".txt": result = GetTextFromPlainText(fullpath); break;
                    default:
                        throw new Exception(result.ToString());
                        //break;
                }
            }
            return result;

        }

        /// <summary>  
        /// Recupera el texto plano de un documento PDF
        /// </summary>  
        /// <returns></returns>  
        private StringBuilder GetTextFromPDF(string path)
        {
            StringBuilder text = new StringBuilder();

            using (PdfReader reader = new PdfReader(path))
            {
                for (int i = 1; i <= reader.NumberOfPages; i++)
                {
                    text.Append(PdfTextExtractor.GetTextFromPage(reader, i)).Append(" ");
                }
            }
            return text;
        }

        /// <summary>  
        /// Recupera el texto plano de un documento de word
        /// </summary>  
        /// <returns></returns>  
        private StringBuilder GetTextFromWord(object path)
        {
            StringBuilder text = new StringBuilder();

            Word.Application word = new Word.Application();

            object miss = System.Reflection.Missing.Value;
            object readOnly = true;
            Word.Document docs = null;
            try
            {
                docs = word.Documents.Open(path, miss, readOnly, miss, miss, miss, miss, miss, miss, miss, miss, miss, miss, miss, miss, miss);

                for (int i = 0; i < docs.Paragraphs.Count; i++)
                {
                    text.Append(docs.Paragraphs[i + 1].Range.Text.ToString()).Append(" ");
                }
            }
            catch (Exception)
            {
            }
            finally
            {
                if (docs != null)
                    docs.Close(false);
                word.Quit(false);
            }

            return text;
        }

        /// <summary>  
        /// Recupera el texto plano de un documento de PowerPoint
        /// </summary>  
        /// <returns></returns>  
        //private StringBuilder GetTextFromPowerPoint(string source)
        //{
        //    StringBuilder text = new StringBuilder();

        //    PowerPoint.Application pa = new PowerPoint.Application();
        //    PowerPoint.Presentation pp = pa.Presentations.Open(source,
        //    Microsoft.Office.Core.MsoTriState.msoTrue,
        //    Microsoft.Office.Core.MsoTriState.msoFalse,
        //    Microsoft.Office.Core.MsoTriState.msoFalse);

        //    foreach (PowerPoint.Slide slide in pp.Slides)
        //    {
        //        foreach (PowerPoint.Shape shape in slide.Shapes)
        //        {
        //            try
        //            {
        //                text.Append(shape.TextFrame.TextRange.Text).Append(" ");
        //            }
        //            catch (Exception)
        //            {
        //            }
        //        }
        //    }
        //    return text;
        //}

        /// <summary>  
        /// Recupera el texto plano de un documento de excel
        /// </summary>  
        /// <returns></returns>  
        private StringBuilder GetTextFromExcel(string path)
        {
            StringBuilder text = new StringBuilder();
            Excel.Application xlApp = new Excel.Application();
            Excel.Workbook xlWorkbook = xlApp.Workbooks.Open(path);
            //TODO: pendiente ajustar con NetOffice
            //Excel._Worksheet xlWorksheet = xlWorkbook.Sheets[1];
            //for (int sh = 1; sh <= xlWorkbook.Sheets.Count; sh++)
            //{
            //    xlWorksheet = xlWorkbook.Sheets[sh];
            //    Excel.Range xlRange = xlWorksheet.UsedRange;

            //    int rowCount = xlRange.Rows.Count;
            //    int colCount = xlRange.Columns.Count;

            //    for (int i = 1; i <= rowCount; i++)
            //    {
            //        for (int j = 1; j <= colCount; j++)
            //        {
            //            try
            //            {
            //                text.Append(xlRange.Cells[i, j].Value2.ToString()).Append(" ");
            //            }
            //            catch (Exception) { }

            //        }
            //    }
            //}
            return text;
        }

        
        /// <summary>  
        /// Recupera el texto plano de un documento de Publisher
        /// </summary>  
        /// <returns></returns>  

        //private StringBuilder GetTextFromPublisher(string path)
        //{
        //    StringBuilder text = new StringBuilder();

        //    Publisher.Application pbApp = new Publisher.Application();
        //    Publisher.Document pbDoc = pbApp.Open(path, true, true, Publisher.PbSaveOptions.pbDoNotSaveChanges);
        //    Publisher.Pages pgs = pbDoc.Pages;

        //    foreach (Publisher.Page pg in pgs)
        //    {
        //        foreach (Publisher.Shape shp in
        //        pg.Shapes)
        //        {
        //            if (shp.HasTextFrame == Microsoft.Office.Core.MsoTriState.msoTrue)
        //            {
        //                //fulltext += shp.TextFrame.TextRange.Text;
        //                text.Append(shp.TextFrame.TextRange.Text).Append(" ");
        //            }

        //            else if (shp.HasTable == Microsoft.Office.Core.MsoTriState.msoTrue)
        //            {
        //                text.Append(" ");
        //                //fulltext += "TABLE!!!!"; // To do!
        //            }

        //        }
        //    }
        //    return text;
        //}


        public  StringBuilder GetTextFromHtml(string html)
        {
            const string tagWhiteSpace = @"(>|$)(\W|\n|\r)+<";//matches one or more (white space or line breaks) between '>' and '<'
            const string stripFormatting = @"<[^>]*(>|$)";//match any character between '<' and '>', even when end tag is missing
            const string lineBreak = @"<(br|BR)\s{0,1}\/{0,1}>";//matches: <br>,<br/>,<br />,<BR>,<BR/>,<BR />
            var lineBreakRegex = new Regex(lineBreak, RegexOptions.Multiline);
            var stripFormattingRegex = new Regex(stripFormatting, RegexOptions.Multiline);
            var tagWhiteSpaceRegex = new Regex(tagWhiteSpace, RegexOptions.Multiline);

            var text = html;
            //Decode html specific characters
            text = System.Net.WebUtility.HtmlDecode(text);
            Escribe.Write("ACH:");
            Escribe.Write(text);
            //Remove tag whitespace/line breaks
            text = tagWhiteSpaceRegex.Replace(text, "><");
            //Replace <br /> with line breaks
            text = lineBreakRegex.Replace(text, Environment.NewLine);
            //Strip formatting
            text = stripFormattingRegex.Replace(text, string.Empty);
            StringBuilder result = new StringBuilder(text);
            return result;

        }
        public StringBuilder GetTextFromPlainText(string path)
        {
            string text = null;
            try
            {
                text = System.IO.File.ReadAllText(path);
            }
            catch (Exception e)
            {
                return null;
            }
            return new StringBuilder(text);
        }

    }
}