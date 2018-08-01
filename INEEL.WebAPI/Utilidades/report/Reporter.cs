using INEEL.WebAPI.Controllers.GENERICOS;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using Word = NetOffice.WordApi;

namespace INEEL.WebAPI.Utilidades.report
{
    /*
     *  Reporter Class using word template
     *  Copyright (C) 2011 Reporter Class KARPOUZAS GEORGE
     *
     *  This program is free software: you can redistribute it and/or modify
     *  it under the terms of the GNU General Public License as published by
     *  the Free Software Foundation, either version 3 of the License, or
     *  (at your option) any later version.
     *
     *  This program is distributed in the hope that it will be useful,
     *  but WITHOUT ANY WARRANTY; without even the implied warranty of
     *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
     *  GNU General Public License for more details.
     *
     *  You should have received a copy of the GNU General Public License
     * along with this program.  If not, see <http://www.gnu.org/licenses/>.
     */
    class Reporter
    {
        private String _template;
        private object oMissing;
        private Object oFalse;
        private Word._Application wordApp;
        private Word._Document wordDoc;

        public Reporter()
        {
            this._template = "";
            this.oMissing = Missing.Value;
            this.oFalse = false;
            this.wordApp = null;
            this.wordDoc = null;
        }

        public void setTemplate(String template)
        {
            if (File.Exists(template))
            {
                
                this.wordApp = new Word.Application();
                this.wordApp.Visible = false;
                this._template = template;
                object oTemplate = this._template;
                wordDoc = wordApp.Documents.Add( oTemplate,  oMissing,  oMissing,  oMissing);
            }
            //break;
        }

        public void print(Dictionary<String, String> keyvalues, String savepath)
        {
            this._create(keyvalues, savepath);
        }
        public HttpResponseMessage GetInResponse(String localFilePath, string nombre, HttpRequestMessage Request)
        {
            UtileriasArchivo util = new UtileriasArchivo();
            return util.GetFile(localFilePath, nombre, Request);
        }
        public void close()
        {
            this.wordDoc.Close(oFalse, oMissing, oMissing);
            this.wordApp.Quit(oMissing, oMissing, oMissing);
        }

        private void _create(Dictionary<String, String> keyvalues, String saveas)
        {
            //https://securityblog.gr/265/create-pdf-report-from-word-template-in-c/
            if (wordDoc != null && wordApp != null)
            {
                foreach (Word.Field field in this.wordDoc.Fields)
                {
                    Word.Range fieldcode = field.Code;
                    String fieldText = fieldcode.Text;

                    if (fieldText.StartsWith(" KEYWORDS") || true)
                    {
                        Int32 endMerge = fieldText.IndexOf("\\");
                        Int32 fieldNameLength = fieldText.Length - endMerge;
                        String fieldName = fieldText.Substring(11, endMerge - 11);

                        fieldName = fieldName.Trim();
                        if (keyvalues.Keys.Contains(fieldName))
                        {
                            field.Select();
                            String value = keyvalues[fieldName];
                            this.wordApp.Selection.TypeText(value == "" ? " " : value);
                        }
                        else
                        {
                            field.Select();
                            this.wordApp.Selection.TypeText(" ");
                        }
                    }
                }
                
                //object fileFormat = Word.WdSaveFormat.wdFormatPDF;

                if (File.Exists(saveas))
                {
                    File.Delete(saveas);
                }

                Object oSaveAsFile = (Object)saveas;

                this.wordDoc.SaveAs(oSaveAsFile, NetOffice.WordApi.Enums.WdExportFormat.wdExportFormatPDF, oMissing, oMissing,
                    oMissing, oMissing, oMissing, oMissing, oMissing,
                    oMissing, oMissing, oMissing, oMissing, oMissing,
                    oMissing, oMissing);
            }
        }
    }
}