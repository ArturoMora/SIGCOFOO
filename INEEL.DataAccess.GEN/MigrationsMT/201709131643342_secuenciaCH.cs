namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class secuenciaCH : DbMigration
    {
        public override void Up()
        {
            //AddColumn("CH.cat_GradoAcademico", "Secuencia", c => c.Int());
        }
        
        public override void Down()
        {
            //DropColumn("CH.cat_GradoAcademico", "Secuencia");
        }
    }
}
