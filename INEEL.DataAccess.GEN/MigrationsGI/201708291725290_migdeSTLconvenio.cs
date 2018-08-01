namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migdeSTLconvenio : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_TecnologiaLicenciada", "ConvenioId", c => c.Int(nullable: false));
            CreateIndex("GI.tab_TecnologiaLicenciada", "ConvenioId");
            AddForeignKey("GI.tab_TecnologiaLicenciada", "ConvenioId", "CR.tab_Convenio", "ConvenioId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_TecnologiaLicenciada", "ConvenioId", "CR.tab_Convenio");
            DropIndex("GI.tab_TecnologiaLicenciada", new[] { "ConvenioId" });
            DropColumn("GI.tab_TecnologiaLicenciada", "ConvenioId");
        }
    }
}
