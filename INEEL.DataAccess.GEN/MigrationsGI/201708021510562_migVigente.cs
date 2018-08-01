namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migVigente : DbMigration
    {
        public override void Up()
        {
            AddColumn("GI.tab_Propuesta", "Vigente", c => c.Boolean(nullable: false));
            AddColumn("GI.tab_Propuesta", "Comentarios", c => c.String());
            AddColumn("GI.tab_Propuesta", "Prioridad", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("GI.tab_Propuesta", "Prioridad");
            DropColumn("GI.tab_Propuesta", "Comentarios");
            DropColumn("GI.tab_Propuesta", "Vigente");
        }
    }
}
