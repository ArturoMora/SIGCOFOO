namespace INEEL.DataAccess.GEN.MigrationsPI
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class proyectodastring : DbMigration
    {
        public override void Up()
        {
            AlterColumn("PI.tab_DerechosAutor", "NumeroProyecto", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("PI.tab_DerechosAutor", "NumeroProyecto", c => c.Int(nullable: true));
        }
    }
}
