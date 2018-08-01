namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class configuracionPostComentarios : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Comentarios", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Comentarios", new[] { "idMiembroCP" });
            AddColumn("CP.tab_Comentarios", "idPersona", c => c.String());
            AddColumn("CP.tab_Post", "publico", c => c.Boolean(nullable: false));
            AddColumn("CP.tab_Post", "accesoGeneral", c => c.Boolean(nullable: false));
            AlterColumn("CP.tab_Comentarios", "idMiembroCP", c => c.Int());
            CreateIndex("CP.tab_Comentarios", "idMiembroCP");
            AddForeignKey("CP.tab_Comentarios", "idMiembroCP", "CP.tab_Miembros", "MiembroId");
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_Comentarios", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Comentarios", new[] { "idMiembroCP" });
            AlterColumn("CP.tab_Comentarios", "idMiembroCP", c => c.Int(nullable: false));
            DropColumn("CP.tab_Post", "accesoGeneral");
            DropColumn("CP.tab_Post", "publico");
            DropColumn("CP.tab_Comentarios", "idPersona");
            CreateIndex("CP.tab_Comentarios", "idMiembroCP");
            AddForeignKey("CP.tab_Comentarios", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: true);
        }
    }
}
