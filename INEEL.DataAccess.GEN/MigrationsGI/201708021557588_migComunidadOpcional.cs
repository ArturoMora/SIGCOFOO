namespace INEEL.DataAccess.GEN.MigrationsGI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migComunidadOpcional : DbMigration
    {
        public override void Up()
        {
            AlterColumn("GI.tab_IdeaInnovadora", "ComunidadPracticaId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("GI.tab_IdeaInnovadora", "ComunidadPracticaId", c => c.Int(nullable: false));
        }
    }
}
