namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class idComunidadDocumentosCP : DbMigration
    {
        public override void Up()
        {
            AddColumn("CP.tab_Documento", "idComunidadCP", c => c.Int(nullable: false));
            CreateIndex("CP.tab_Documento", "idComunidadCP");
            AddForeignKey("CP.tab_Documento", "idComunidadCP", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_Documento", "idComunidadCP", "CP.tab_Comunidades");
            DropIndex("CP.tab_Documento", new[] { "idComunidadCP" });
            DropColumn("CP.tab_Documento", "idComunidadCP");
        }
    }
}
