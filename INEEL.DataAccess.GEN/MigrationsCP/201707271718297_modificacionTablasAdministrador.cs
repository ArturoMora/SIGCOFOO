namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modificacionTablasAdministrador : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_SitioInteres", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Documento", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Preguntas", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_SitioInteres", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Documento", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Preguntas", new[] { "idMiembroCP" });
            AddColumn("CP.tab_SitioInteres", "idPersona", c => c.String());
            AddColumn("CP.tab_Documento", "idPersona", c => c.String());
            AddColumn("CP.tab_Preguntas", "idPersona", c => c.String());
            AlterColumn("CP.tab_SitioInteres", "idMiembroCP", c => c.Int());
            AlterColumn("CP.tab_Documento", "idMiembroCP", c => c.Int());
            AlterColumn("CP.tab_Preguntas", "idMiembroCP", c => c.Int());
            CreateIndex("CP.tab_SitioInteres", "idMiembroCP");
            CreateIndex("CP.tab_Documento", "idMiembroCP");
            CreateIndex("CP.tab_Preguntas", "idMiembroCP");
            AddForeignKey("CP.tab_SitioInteres", "idMiembroCP", "CP.tab_Miembros", "MiembroId");
            AddForeignKey("CP.tab_Documento", "idMiembroCP", "CP.tab_Miembros", "MiembroId");
            AddForeignKey("CP.tab_Preguntas", "idMiembroCP", "CP.tab_Miembros", "MiembroId");
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_Preguntas", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_Documento", "idMiembroCP", "CP.tab_Miembros");
            DropForeignKey("CP.tab_SitioInteres", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Preguntas", new[] { "idMiembroCP" });
            DropIndex("CP.tab_Documento", new[] { "idMiembroCP" });
            DropIndex("CP.tab_SitioInteres", new[] { "idMiembroCP" });
            AlterColumn("CP.tab_Preguntas", "idMiembroCP", c => c.Int(nullable: false));
            AlterColumn("CP.tab_Documento", "idMiembroCP", c => c.Int(nullable: false));
            AlterColumn("CP.tab_SitioInteres", "idMiembroCP", c => c.Int(nullable: false));
            DropColumn("CP.tab_Preguntas", "idPersona");
            DropColumn("CP.tab_Documento", "idPersona");
            DropColumn("CP.tab_SitioInteres", "idPersona");
            CreateIndex("CP.tab_Preguntas", "idMiembroCP");
            CreateIndex("CP.tab_Documento", "idMiembroCP");
            CreateIndex("CP.tab_SitioInteres", "idMiembroCP");
            AddForeignKey("CP.tab_Preguntas", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: false);
            AddForeignKey("CP.tab_Documento", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: false);
            AddForeignKey("CP.tab_SitioInteres", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: false);
        }
    }
}
