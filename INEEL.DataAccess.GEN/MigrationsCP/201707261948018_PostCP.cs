namespace INEEL.DataAccess.GEN.MigrationsCP
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PostCP : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CP.tab_Post", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Post", new[] { "idMiembroCP" });
            AddColumn("CP.tab_Post", "idPersona", c => c.String());
            AlterColumn("CP.tab_Post", "idMiembroCP", c => c.Int());
            CreateIndex("CP.tab_Post", "idMiembroCP");
            AddForeignKey("CP.tab_Post", "idMiembroCP", "CP.tab_Miembros", "MiembroId");
        }
        
        public override void Down()
        {
            DropForeignKey("CP.tab_Post", "idMiembroCP", "CP.tab_Miembros");
            DropIndex("CP.tab_Post", new[] { "idMiembroCP" });
            AlterColumn("CP.tab_Post", "idMiembroCP", c => c.Int(nullable: false));
            DropColumn("CP.tab_Post", "idPersona");
            CreateIndex("CP.tab_Post", "idMiembroCP");
            AddForeignKey("CP.tab_Post", "idMiembroCP", "CP.tab_Miembros", "MiembroId", cascadeDelete: false);
        }
    }
}
