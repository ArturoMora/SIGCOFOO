namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModificaTablaAutoresCP : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Autores", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Autores", new[] { "idMiembroCP" });
            AddColumn("CP.tab_Autores", "idPersona", c => c.Int(nullable: false));
            DropColumn("CP.tab_Autores", "idMiembroCP");
        }
        
        public override void Down()
        {
            AddColumn("CP.tab_Autores", "idMiembroCP", c => c.Int(nullable: false));
            DropColumn("CP.tab_Autores", "idPersona");
            CreateIndex("CP.tab_Autores", "idMiembroCP");
            AddForeignKey("CP.tab_Autores", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: true);
        }
    }
}
