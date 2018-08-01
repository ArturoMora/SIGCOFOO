namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migLecciones2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_TecnologiaLicenciadaLecciones", "TecnologiaLicenciadaId", c => c.Int(nullable: false));
            AddColumn("GI.tab_TecnologiaLicenciadaLecciones", "ClavePersona", c => c.String());
            CreateIndex("GI.tab_TecnologiaLicenciadaLecciones", "TecnologiaLicenciadaId");
            AddForeignKey("GI.tab_TecnologiaLicenciadaLecciones", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada", "TecnologiaLicenciadaId", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("GI.tab_TecnologiaLicenciadaLecciones", "TecnologiaLicenciadaId", "GI.tab_TecnologiaLicenciada");
            DropIndex("GI.tab_TecnologiaLicenciadaLecciones", new[] { "TecnologiaLicenciadaId" });
            DropColumn("GI.tab_TecnologiaLicenciadaLecciones", "ClavePersona");
            DropColumn("GI.tab_TecnologiaLicenciadaLecciones", "TecnologiaLicenciadaId");
        }
    }
}
