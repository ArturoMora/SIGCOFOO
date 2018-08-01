namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migracionCPcorregida : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades");
            DropIndex("CP.tab_Lineamientos", new[] { "idCP" });
            //AddColumn("GEN.cat_Modulo", "Url", c => c.String());
            //AddColumn("GEN.cat_Modulo", "UrlImagen", c => c.String());
            //AddColumn("GEN.cat_Modulo", "Secuencia", c => c.Int(nullable: false));
            DropColumn("CP.tab_Lineamientos", "idCP");
        }
        
        public override void Down()
        {
            AddColumn("CP.tab_Lineamientos", "idCP", c => c.Int(nullable: false));
            //DropColumn("GEN.cat_Modulo", "Secuencia");
            //DropColumn("GEN.cat_Modulo", "UrlImagen");
            //DropColumn("GEN.cat_Modulo", "Url");
            CreateIndex("CP.tab_Lineamientos", "idCP");
            AddForeignKey("CP.tab_Lineamientos", "idCP", "CP.tab_Comunidades", "ComunidadId", cascadeDelete: false);
        }
    }
}
